        function generateFinalText(data) {
            let finalText = "";
            if (data.isSiape) {
                if (data.nome) finalText += `👤 **NOME:** ${data.nome}\n`;
                if (data.cpf) finalText += `🆔 **CPF:** ${data.cpf}\n`;
                if (data.nascimento) finalText += `�� **NASCIMENTO:** ${data.nascimento}\n`;
                if (data.cargo) finalText += `CARGO: ${data.cargo}\n`;
                if (data.valor) finalText += `💰 **VALOR SALARIO:** ${data.valor}\n`;
                
                finalText += `🏦 **BANCO:** ${data.banco || "-"} | **AG:** ${data.agencia || "-"} | **CC:** ${data.conta || "-"}\n`;
                
                let end = `📍 **ENDEREÇO:** `;
                if (data.bairro) end += `${data.bairro}, `;
                if (data.cidade) end += `"${data.cidade}" `;
                if (data.rua) end += `${data.rua} `;
                end += `- (${data.cep ? data.cep : "em branco pois não tem cep"}) `;
                if (data.ufRaw) end += `${data.ufRaw}`;
                finalText += end + `\n`;

                if (data.telefones && data.telefones.length > 0) {
                    finalText += `TELEFONES:\n\n`;
                    data.telefones.forEach(p => finalText += `${p}\n`);
                }
            } else {
                if (data.nome) finalText += `👤 **NOME:** ${data.nome}\n`;
                if (data.cpf) finalText += `🆔 **CPF:** ${data.cpf}\n`;
                if (data.nascimento) finalText += `📅 **NASCIMENTO:** ${data.nascimento}\n`;
                if (data.valor) finalText += `💰 **VALOR BENEFÍCIO:** ${data.valor}\n`;
                if (data.banco || data.agencia || data.conta) {
                    finalText += `🏦 **BANCO:** ${data.banco || "-"} | **AG:** ${data.agencia || "-"} | **CC:** ${data.conta || "-"}\n`;
                }
                if (data.especie) finalText += `🔢 **ESPÉCIE:** ${data.especie}\n`;
                if (data.endereco) finalText += `📍 **ENDEREÇO:** ${data.endereco}\n\n`;
                if (data.emails && data.emails.length > 0) {
                    finalText += `📧 **EMAILS:**\n`;
                    data.emails.forEach(e => finalText += `  • ${e}\n`);
                    finalText += `\n`;
                }
                if (data.telefones && data.telefones.length > 0) {
                    finalText += `📱 **TELEFONES:**\n`;
                    data.telefones.forEach(p => finalText += `  • ${p}\n`);
                }
            }
            return finalText.trim() + "\n";
        }