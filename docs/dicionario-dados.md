# Dicionário de dados (resumo)

A versão completa, com os 29 dataframes, status de evidência (E1/E2/E3) e relacionamentos, está no documento "Dicionário de Dados HEAL" do projeto. Abaixo, as tabelas usadas pelo mockup.

| Arquivo em data/mock | Tabela | Origem no processo atual |
| --- | --- | --- |
| orc_consolidado_itens.json | orc_consolidado_itens | Consolidado, aba DESP_E_INVEST |
| orc_novas_vagas.json | orc_novas_vagas | Matriz, aba NOVAS_VAGAS |
| aud_alertas.json | aud_alertas | Consolidado, aba ALERTAS |
| aud_controle_arquivos.json | aud_controle_arquivos | Consolidado, aba CONTROLE_ARQUIVOS |
| orc_rodadas.json | orc_rodadas | Totais por rodada de consolidação |
| cad_centros_custo.json | cad_centros_custo | Cadastro de centros de custo da matriz |
| cad_contas_orcamentarias.json | cad_contas_orcamentarias | Matriz, aba CONTAS |

## orc_consolidado_itens

| Variável | Tipo | Descrição |
| --- | --- | --- |
| id | texto | D-nnn (despesa) ou I-nnn (investimento) |
| setor, setor_sigla | texto | Setor remetente |
| diretoria | texto | Diretoria do centro de custo |
| centro_custo_rotulo | texto | "código – nome" |
| natureza_cc | enum | Operacional ou Administrativo |
| grupo_gasto | texto | Grupo de gasto |
| conta_orcamentaria | texto | Conta final |
| conta_contabil | texto | 4.2.x, 4.3.x ou 1.2.x |
| item_descricao | texto | Descrição do item |
| situacao | enum | Novo, Continuidade, Substituição, Ampliação |
| prioridade | enum | 1 – Essencial, 2 – Importante, 3 – Desejável |
| frequencia | enum | Única, Mensal, Trimestral, Anual |
| mes_inicio | enum | JAN–DEZ |
| quantidade | decimal | Quantidade |
| valor_unitario | monetário | Valor unitário (R$) |
| base_calculo | texto | Memória de cálculo |
| fonte_valor | texto | Origem do valor |
| valor_2026 | monetário | Valor de 2026 (itens de continuidade) |
| justificativa | texto | Justificativa do setor |
| valor_jan … valor_dez | monetário | Valor por mês de 2027 |
| total_2027 | monetário | Soma dos meses |
| tipo_informado | enum | Tipo marcado pelo setor (pode estar em branco) |
| conta_informada | texto | Conta original do setor |
| classificacao_final | enum | Despesa ou Investimento |
| motivo_reclassificacao | texto | Motivo quando a classificação mudou |
| alertas | lista | Tipo e detalhe de cada alerta |
| status_linha | texto | OK, Com alerta, Erro de fórmula na origem |
| arquivo_origem, linha_origem | texto, inteiro | Rastreio da origem |

## orc_novas_vagas

`id, setor, setor_sigla, diretoria, centro_custo_rotulo, cargo, qtd_vagas, mes_inicio, prioridade, justificativa, salario_base, fator_encargos, custo_mensal_vaga (= salário × fator × 13 ÷ 12), valor_jan … valor_dez, total_2027, alertas, arquivo_origem, linha_origem`.

## aud_alertas

`id_item, setor, item, classificacao_final, total_2027, tipo_alerta, detalhe, status (Aberto/Resolvido)`.

## aud_controle_arquivos

`arquivo, setor, responsavel, cargo_area, data, data_prevista, usado, total_pedidos_arquivo, total_vagas_arquivo, consolidado_despesas, consolidado_investimentos, consolidado_vagas, diferenca, observacao`.
