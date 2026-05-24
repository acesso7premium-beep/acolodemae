
-- 1. Enum de papéis
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'membro');

-- 2. Tabela de perfis
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Tabela de papéis
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Função security definer para checar papéis (evita recursão em RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Trigger para timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Trigger: cria perfil + papel padrão "membro" ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'membro')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. RLS: profiles
CREATE POLICY "Profiles visíveis para o dono e super admins"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Usuário atualiza o próprio perfil"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Super admins atualizam qualquer perfil"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- 8. RLS: user_roles
CREATE POLICY "Usuário vê os próprios papéis"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins gerenciam papéis"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- 9. Bootstrap: claim_super_admin
-- Permite que o PRIMEIRO usuário que informe o código correto vire super_admin.
-- Depois que existir 1 super_admin, este caminho fica bloqueado.
CREATE OR REPLACE FUNCTION public.claim_super_admin(_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _already_exists BOOLEAN;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Faça login antes de reivindicar super admin';
  END IF;

  IF _code IS DISTINCT FROM '82ENW' THEN
    RETURN FALSE;
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'super_admin')
    INTO _already_exists;

  IF _already_exists THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, 'super_admin')
  ON CONFLICT DO NOTHING;

  RETURN TRUE;
END;
$$;
