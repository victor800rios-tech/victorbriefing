
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.briefing_status AS ENUM ('novo','em_analise','proposta_enviada','em_desenvolvimento','concluido');

-- user_roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- briefings
CREATE TABLE public.briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status briefing_status NOT NULL DEFAULT 'novo',

  -- Identificação
  empresa text NOT NULL,
  responsavel text NOT NULL,
  data_briefing date NOT NULL DEFAULT CURRENT_DATE,

  -- 01 Sobre a empresa
  q1_nome_empresa text,
  q2_o_que_faz text,
  q3_publico_alvo text,
  q4_tempo_existencia text,
  q5_diferenciais text,

  -- 02 Identidade visual
  q6_possui_identidade text,
  q7_observacoes_identidade text,
  q8_deseja_desenvolver_identidade text,

  -- 03 Objetivo
  q9_objetivo_site text,
  q10_definicao_sucesso text,

  -- 04 Estrutura
  q11_quantas_paginas text,
  q12_paginas_desejadas text,
  q13_pagina_especifica text,

  -- 05 Funcionalidades
  q14_form_contato text,
  q15_catalogo text,
  q16_blog text,
  q17_loja_virtual text,
  q18_redes_sociais text,
  q19_whatsapp text,

  -- 06 Conteúdo
  q20_textos text,
  q21_fotos_videos text,
  q22_conteudo_destaque text,

  -- 07 Referências
  q23_sites_referencia text,
  q24_sites_evitar text,

  -- 08 Aspectos técnicos
  q25_dominio text,
  q26_site_atual text,

  -- 09 Prazo e investimento
  q27_prazo text,
  q28_data_importante text,
  q29_investimento text
);

CREATE INDEX briefings_empresa_idx ON public.briefings (lower(empresa));
CREATE INDEX briefings_responsavel_idx ON public.briefings (lower(responsavel));
CREATE INDEX briefings_status_idx ON public.briefings (status);
CREATE INDEX briefings_created_at_idx ON public.briefings (created_at DESC);

CREATE TRIGGER briefings_set_updated_at BEFORE UPDATE ON public.briefings
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

GRANT INSERT ON public.briefings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.briefings TO authenticated;
GRANT ALL ON public.briefings TO service_role;
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit briefing" ON public.briefings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read briefings" ON public.briefings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update briefings" ON public.briefings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete briefings" ON public.briefings FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- briefing_files
CREATE TABLE public.briefing_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id uuid NOT NULL REFERENCES public.briefings(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX briefing_files_briefing_idx ON public.briefing_files (briefing_id);

GRANT INSERT ON public.briefing_files TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.briefing_files TO authenticated;
GRANT ALL ON public.briefing_files TO service_role;
ALTER TABLE public.briefing_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone insert briefing files" ON public.briefing_files FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read briefing files" ON public.briefing_files FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete briefing files" ON public.briefing_files FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Auto-promote victor008rios@gmail.com to admin on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'victor008rios@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();
