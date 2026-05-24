
-- Substituir policy WITH CHECK (true) por verificação real
DROP POLICY IF EXISTS "Inserir credenciais ao criar cadastro" ON public.cadastro_credenciais;

CREATE POLICY "Inserir credenciais quando cadastro existe"
ON public.cadastro_credenciais FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cadastros c
    WHERE c.id = cadastro_credenciais.cadastro_id
      AND c.aceite_lgpd = true
      AND c.aceite_termo = true
  )
);

-- Garantir revogação de execução nas funções de trigger
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
