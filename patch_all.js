        function processLine(line) {
            const cleanLine = line.replace(/(^"|"$)/g, "").replace(/""/g, "\""");
            let parts = cleanLine.split("\t");
            if (parts.length < 5) parts = cleanLine.split(";");
            if (parts.length < 5) return null;

            const isSiape = cleanLine.toUpperCase().includes("SIAPE");

            if (isSiape) {
                let matricula = parts[0] ? parts[0].trim() : "";
                let rawCpf = (parts[1] || "").replace(/\D/g, "").replace(/^0+/, "");
                let cpfFormatado = rawCpf;
                if (rawCpf.length > 2) {
                    cpfFormatado = rawCpf.slice(0, -2) + "-" + rawCpf.slice(-2);
                }

                let nome = parts[2] ? parts[2].trim() : "";
                let nasc = parts[4] ? parts[4].trim() : "";
                
                // Correcao de Data (Siape envia MM/DD/YYYY ou similar as vezes, forcar DD/目/YYYY)
                if (nasc.includes("/")) {
                    let dParts = nasc.split("/");
                    if (dParts.length === 3) {
                        // Se o primeiro for > 12, ja esta no formato DD/MM/YYYY
                        // Se o segundo for > 12, esta MM/DD/YYYY
                        // Se ambos forem <= 12, e ambiguo, mas assumimos DD/MM/YYYY a menos que detectemos o erro
                        let p1 = parseInt(dParts[0]);
                        let p2 = parseInt(dParts[1]);
                        if (p2 > 12) {
                            // Era MM/DD/YYYY -> Inverter
                            nasc = `${dParts[1].padStart(2, "0")}/${dParts[0].padStart(2, "0")}/${dParts[2]}`;
                        } else {
                            // Forcar 2 digitos no dia e mes e 4 no ano se possivel
                            let year = dParts[2].length === 2 ? (parseInt(dParts[2]) > 30 ? "19" + dParts[2] : "20" + dParts[2]) : dParts[2];
                            nasc = `${dParts[0].padStart(2, "0")}/${dParts[1].padStart(2, "0")}/${year}`;
                        }
                    }
                }

                let cargo = parts[7] ? parts[7].trim() : "";
                let valorCru = parts[9] ? parts[9].trim() : "";
                
                let banco = parts[13] ? parts[13].trim() : "";
                let agencia = parts[14] ? parts[14].trim() : "";
                let conta = parts[15] ? parts[15].trim() : "";

                let uf = parts[16] ? parts[16].trim() : "";
                let cidade = parts[17] ? parts[17].trim() : "";
                let bairro = parts[18] ? parts[18].trim() : "";
                let rua = parts[19] ? parts[19].trim() : "";
                let cep = parts[20] ? parts[20].trim() : "";

                let rawPhones = [];
                if (parts[21]) rawPhones.push(parts[21].replace(/\D/g, ""));
                if (parts[22]) rawPhones.push(parts[22].replace(/\D/g, ""));
                if (parts[23]) rawPhones.push(parts[23].replace(/\D/g, ""));
                let phones = [...new Set(rawPhones.filter(p => p.length >= 8))];

                return {
                    isSiape: true,
                    nome: nome,
                    cpf: cpfFormatado,
                    nb: matricula,
                    nascimento: nasc,
                    cargo: cargo,
                    valor: valorCru ? "R$ " + valorCru : "",
                    banco: banco,
                    agencia: agencia,
                    conta: conta,
                    ufRaw: uf,
                    cidade: cidade,
                    bairro: bairro,
                    rua: rua,
                    cep: cep,
                    telefones: phones,
                    valorRaw: parseFloat(valorCru.replace(",", ".")) || 0
                };
            } else {
                let nb = parts[0] ? parts[0].trim() : "";
                let rawCpf = parts[1] || "";
                let cpfDigits = rawCpf.replace(/\D/g, "");
                let cpfFormatado = cpfDigits;
                if (cpfDigits.length === 11) {
                    cpfFormatado = cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                }

                let nome = parts[2] ? parts[2].trim() : "";
                let valorCru = parts[6] ? parts[6].trim() : "";
                let nasc = parts[7] ? parts[7].trim() : "";
                let especie = parts[10] ? parts[10].trim() : "";
                let banco = parts[12] ? parts[12].replace(/^0+/, "").trim() : "";
                let agencia = parts[13] ? parts[13].trim() : "";
                let conta = parts[14] ? parts[14].trim() : "";
                let municipio = parts[15] ? parts[15].trim() : "";
                let uf = parts[16] ? parts[16].trim() : "";
                let bairro = parts[17] ? parts[17].trim() : "";
                let rua = parts[18] ? parts[18].trim() : "";

                let enderecoCompleto = "";
                if (rua && rua !== "NAO" && rua !== "") {
                    enderecoCompleto += rua;
                    if (bairro && bairro !== "NAO" && bairro !== "") enderecoCompleto += ", " + bairro;
                    if (municipio && municipio !== "NAO" && municipio !== "") enderecoCompleto += " - " + municipio;
                    if (uf && uf !== "NAO" && uf !== "") enderecoCompleto += " " + uf;
                }

                let rawPhones = [];
                if (parts[29]) rawPhones.push(parts[29].replace(/\D/g, ""));
                if (parts[30]) rawPhones.push(parts[30].replace(/\D/g, ""));
                if (parts[31]) rawPhones.push(parts[31].replace(/\D/g, ""));
                let phones = [...new Set(rawPhones.filter(p => p.length >= 8))];

                let rawEmails = [];
                if (parts[32] && parts[32].includes("@")) rawEmails.push(parts[32].trim());
                if (parts[33] && parts[33].includes("@")) rawEmails.push(parts[33].trim());
                if (parts[34] && parts[34].includes("@")) rawEmails.push(parts[34].trim());

                return {
                    isSiape: false,
                    nb: nb,
                    cpf: cpfFormatado,
                    nome: nome,
                    valor: valorCru ? "R$ " + valorCru : "",
                    nascimento: nasc,
                    especie: especie,
                    banco: banco,
                    agencia: agencia,
                    conta: conta,
                    endereco: enderecoCompleto,
                    emails: rawEmails,
                    telefones: phones,
                    ufRaw: uf,
                    valorRaw: parseFloat(valorCru.replace(".", "").replace(",", ".")) || 0
                };
            }
        }

        function generateFinalText(data) {
            let finalText = "";
            if (data.isSiape) {
                if (data.nome) finalText += `👤 **NOME:** ${data.nome}\n`;
                if (data.cpf) finalText += `🆔 **CPF:** ${data.cpf}\n`;
                if (data.nascimento) finalText += `📅 **NASCIMENTO:** ${data.nascimento}\n`;
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
                if (data.cpf) finalText += `�� **CPF:** ${data.cpf}\n`;
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