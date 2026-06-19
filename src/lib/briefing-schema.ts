import { z } from "zod";

const req = (label: string) =>
  z.string({ required_error: `${label} é obrigatório` }).trim().min(1, `${label} é obrigatório`);

const opt = () => z.string().trim().optional().or(z.literal(""));

export type FieldType = "text" | "textarea" | "date" | "select";

export type FieldDef = {
  name: keyof BriefingFormValues;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  helper?: string;
};

export type StepDef = {
  id: string;
  index: string; // "00"
  title: string;
  description: string;
  fields: FieldDef[];
  upload?: boolean;
};

export const STEPS: StepDef[] = [
  {
    id: "identificacao",
    index: "00",
    title: "Identificação",
    description:
      "Vamos começar com algumas informações básicas para identificar este briefing.",
    fields: [
      { name: "empresa", label: "Empresa", type: "text", required: true, placeholder: "Nome da empresa" },
      { name: "responsavel", label: "Responsável pelas respostas", type: "text", required: true, placeholder: "Seu nome completo" },
      { name: "data_briefing", label: "Data", type: "date", required: true },
    ],
  },
  {
    id: "empresa",
    index: "01",
    title: "Sobre a Empresa",
    description: "Conte-nos sobre o seu negócio, o que faz e para quem.",
    fields: [
      { name: "q1_nome_empresa", label: "Qual o nome da empresa?", type: "text", required: true },
      { name: "q2_o_que_faz", label: "O que a empresa faz? Quais produtos ou serviços oferece?", type: "textarea", required: true },
      { name: "q3_publico_alvo", label: "Quem é o público-alvo?", type: "textarea", required: true },
      { name: "q4_tempo_existencia", label: "Há quanto tempo a empresa existe?", type: "text" },
      { name: "q5_diferenciais", label: "Quais são os principais diferenciais da empresa?", type: "textarea" },
    ],
  },
  {
    id: "identidade",
    index: "02",
    title: "Identidade Visual",
    description:
      "Anexe sua identidade visual existente ou conte-nos se deseja desenvolvê-la junto com o site.",
    upload: true,
    fields: [
      {
        name: "q6_possui_identidade",
        label: "A empresa já possui logo, cores e fontes definidas?",
        type: "select",
        required: true,
        options: ["Sim, tudo definido", "Parcialmente", "Não possui"],
      },
      {
        name: "q7_observacoes_identidade",
        label: "Observações sobre a identidade visual (envie arquivos abaixo se possuir)",
        type: "textarea",
        helper: "Use o campo de upload abaixo para enviar logo, manual da marca e materiais relacionados.",
      },
      {
        name: "q8_deseja_desenvolver_identidade",
        label: "Caso não possua identidade visual, deseja desenvolvê-la junto com o site?",
        type: "select",
        options: ["Sim", "Não", "Talvez"],
      },
    ],
  },
  {
    id: "objetivo",
    index: "03",
    title: "Objetivo do Site",
    description: "O que esperar deste projeto e como medir seu sucesso.",
    fields: [
      { name: "q9_objetivo_site", label: "Qual o principal objetivo do site?", type: "textarea", required: true },
      { name: "q10_definicao_sucesso", label: "O que definirá o sucesso deste projeto?", type: "textarea", required: true },
    ],
  },
  {
    id: "estrutura",
    index: "04",
    title: "Estrutura e Páginas",
    description: "Defina a arquitetura geral do site.",
    fields: [
      { name: "q11_quantas_paginas", label: "Quantas páginas o site deverá possuir?", type: "text" },
      { name: "q12_paginas_desejadas", label: "Quais páginas deseja incluir?", type: "textarea", placeholder: "Ex: Home, Sobre, Serviços, Contato..." },
      { name: "q13_pagina_especifica", label: "Existe alguma página específica além das tradicionais?", type: "textarea" },
    ],
  },
  {
    id: "funcionalidades",
    index: "05",
    title: "Funcionalidades",
    description: "Quais recursos o site precisa oferecer?",
    fields: [
      { name: "q14_form_contato", label: "O site precisa de formulário de contato?", type: "select", options: ["Sim", "Não"] },
      { name: "q15_catalogo", label: "O site precisa de catálogo de produtos?", type: "select", options: ["Sim", "Não"] },
      { name: "q16_blog", label: "O site precisa de blog ou área de notícias?", type: "select", options: ["Sim", "Não"] },
      { name: "q17_loja_virtual", label: "O site precisa de loja virtual?", type: "select", options: ["Sim", "Não"] },
      { name: "q18_redes_sociais", label: "O site precisa de integração com redes sociais? Quais?", type: "textarea" },
      { name: "q19_whatsapp", label: "O site precisa de botão de contato via WhatsApp?", type: "select", options: ["Sim", "Não"] },
    ],
  },
  {
    id: "conteudo",
    index: "06",
    title: "Conteúdo",
    description: "Sobre os textos, imagens e materiais que farão parte do site.",
    fields: [
      { name: "q20_textos", label: "Você já possui os textos do site ou precisa de ajuda para escrevê-los?", type: "textarea" },
      { name: "q21_fotos_videos", label: "Você já possui fotos e vídeos de qualidade?", type: "textarea" },
      { name: "q22_conteudo_destaque", label: "Existe algum conteúdo importante que deseja destacar?", type: "textarea", placeholder: "Depoimentos, certificações, prêmios, números, cases..." },
    ],
  },
  {
    id: "referencias",
    index: "07",
    title: "Referências",
    description: "Sites que você admira ou que prefere evitar.",
    fields: [
      { name: "q23_sites_referencia", label: "Existe algum site que você admira e gostaria de utilizar como referência?", type: "textarea" },
      { name: "q24_sites_evitar", label: "Existe algum site que você não gostaria que o seu lembrasse?", type: "textarea" },
    ],
  },
  {
    id: "tecnicos",
    index: "08",
    title: "Aspectos Técnicos",
    description: "Informações sobre infraestrutura existente.",
    fields: [
      { name: "q25_dominio", label: "A empresa já possui domínio registrado?", type: "textarea", placeholder: "Se sim, qual?" },
      { name: "q26_site_atual", label: "Já existe um site atualmente?", type: "textarea", placeholder: "Se sim, qual o endereço?" },
    ],
  },
  {
    id: "prazo",
    index: "09",
    title: "Prazo e Investimento",
    description: "Vamos alinhar expectativas de tempo e orçamento.",
    fields: [
      { name: "q27_prazo", label: "Existe um prazo desejado para colocar o site no ar?", type: "text" },
      { name: "q28_data_importante", label: "Existe alguma data importante relacionada ao projeto?", type: "text" },
      { name: "q29_investimento", label: "Qual a faixa de investimento prevista para este projeto?", type: "text" },
    ],
  },
];

export const briefingSchema = z.object({
  empresa: req("Empresa"),
  responsavel: req("Responsável"),
  data_briefing: req("Data"),

  q1_nome_empresa: req("Nome da empresa"),
  q2_o_que_faz: req("Descrição"),
  q3_publico_alvo: req("Público-alvo"),
  q4_tempo_existencia: opt(),
  q5_diferenciais: opt(),

  q6_possui_identidade: req("Resposta"),
  q7_observacoes_identidade: opt(),
  q8_deseja_desenvolver_identidade: opt(),

  q9_objetivo_site: req("Objetivo do site"),
  q10_definicao_sucesso: req("Definição de sucesso"),

  q11_quantas_paginas: opt(),
  q12_paginas_desejadas: opt(),
  q13_pagina_especifica: opt(),

  q14_form_contato: opt(),
  q15_catalogo: opt(),
  q16_blog: opt(),
  q17_loja_virtual: opt(),
  q18_redes_sociais: opt(),
  q19_whatsapp: opt(),

  q20_textos: opt(),
  q21_fotos_videos: opt(),
  q22_conteudo_destaque: opt(),

  q23_sites_referencia: opt(),
  q24_sites_evitar: opt(),

  q25_dominio: opt(),
  q26_site_atual: opt(),

  q27_prazo: opt(),
  q28_data_importante: opt(),
  q29_investimento: opt(),
});

export type BriefingFormValues = z.infer<typeof briefingSchema>;

export const defaultBriefingValues: BriefingFormValues = {
  empresa: "",
  responsavel: "",
  data_briefing: new Date().toISOString().slice(0, 10),
  q1_nome_empresa: "",
  q2_o_que_faz: "",
  q3_publico_alvo: "",
  q4_tempo_existencia: "",
  q5_diferenciais: "",
  q6_possui_identidade: "",
  q7_observacoes_identidade: "",
  q8_deseja_desenvolver_identidade: "",
  q9_objetivo_site: "",
  q10_definicao_sucesso: "",
  q11_quantas_paginas: "",
  q12_paginas_desejadas: "",
  q13_pagina_especifica: "",
  q14_form_contato: "",
  q15_catalogo: "",
  q16_blog: "",
  q17_loja_virtual: "",
  q18_redes_sociais: "",
  q19_whatsapp: "",
  q20_textos: "",
  q21_fotos_videos: "",
  q22_conteudo_destaque: "",
  q23_sites_referencia: "",
  q24_sites_evitar: "",
  q25_dominio: "",
  q26_site_atual: "",
  q27_prazo: "",
  q28_data_importante: "",
  q29_investimento: "",
};

export const FIELD_LABELS: Record<string, string> = STEPS.flatMap((s) =>
  s.fields.map((f) => [f.name as string, f.label] as const),
).reduce<Record<string, string>>((acc, [k, v]) => ((acc[k] = v), acc), {});
