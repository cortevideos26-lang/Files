import re

path = r'c:\Users\czux1\OneDrive\Desktop\Dados E Filtragem\index.html'
content = open(path, 'rb').read()

# Remove BOM if present
if content.startswith(b'\xef\xbb\xbf'):
    content = content[3:]
    print('Removed BOM')

text = content.decode('utf-8')

new_func = (
    "function generateFinalText(data) {\n"
    "            let finalText = \"\";\n"
    "            if (data.isSiape) {\n"
    "                if (data.nome) finalText += `\U0001f464 **NOME:** ${data.nome}\\n`;\n"
    "                if (data.cpf) finalText += `\U0001f194 **CPF:** ${data.cpf}\\n`;\n"
    "                if (data.nascimento) finalText += `\U0001f4c5 **NASCIMENTO:** ${data.nascimento}\\n`;\n"
    "                if (data.cargo) finalText += `CARGO: ${data.cargo}\\n`;\n"
    "                if (data.valor) finalText += `\U0001f4b0 **VALOR SALARIO:** ${data.valor}\\n`;\n"
    "                \n"
    "                finalText += `\U0001f3e6 **BANCO:** ${data.banco || '-'} | **AG:** ${data.agencia || '-'} | **CC:** ${data.conta || '-'}\\n`;\n"
    "                \n"
    "                let end = `\U0001f4cd **ENDERECO:** `;\n"
    "                if (data.bairro) end += `${data.bairro}, `;\n"
    "                if (data.cidade) end += `\"${data.cidade}\" `;\n"
    "                if (data.rua) end += `${data.rua} `;\n"
    "                end += `- (${data.cep ? data.cep : 'em branco pois nao tem cep'}) `;\n"
    "                if (data.ufRaw) end += `${data.ufRaw}`;\n"
    "                finalText += end + `\\n`;\n"
    "\n"
    "                if (data.telefones && data.telefones.length > 0) {\n"
    "                    finalText += `TELEFONES:\\n\\n`;\n"
    "                    data.telefones.forEach(p => finalText += `${p}\\n`);\n"
    "                }\n"
    "            } else {\n"
    "                if (data.nome) finalText += `\U0001f464 **NOME:** ${data.nome}\\n`;\n"
    "                if (data.cpf) finalText += `\U0001f194 **CPF:** ${data.cpf}\\n`;\n"
    "                if (data.nascimento) finalText += `\U0001f4c5 **NASCIMENTO:** ${data.nascimento}\\n`;\n"
    "                if (data.valor) finalText += `\U0001f4b0 **VALOR BENEFICIO:** ${data.valor}\\n`;\n"
    "                if (data.banco || data.agencia || data.conta) {\n"
    "                    finalText += `\U0001f3e6 **BANCO:** ${data.banco || '-'} | **AG:** ${data.agencia || '-'} | **CC:** ${data.conta || '-'}\\n`;\n"
    "                }\n"
    "                if (data.especie) finalText += `\U0001f522 **ESPECIE:** ${data.especie}\\n`;\n"
    "                if (data.endereco) finalText += `\U0001f4cd **ENDERECO:** ${data.endereco}\\n\\n`;\n"
    "                if (data.emails && data.emails.length > 0) {\n"
    "                    finalText += `\U0001f4e7 **EMAILS:**\\n`;\n"
    "                    data.emails.forEach(e => finalText += `  - ${e}\\n`);\n"
    "                    finalText += `\\n`;\n"
    "                }\n"
    "                if (data.telefones && data.telefones.length > 0) {\n"
    "                    finalText += `\U0001f4f1 **TELEFONES:**\\n`;\n"
    "                    data.telefones.forEach(p => finalText += `  - ${p}\\n`);\n"
    "                }\n"
    "            }\n"
    "            return finalText.trim() + \"\\n\";\n"
    "        }"
)

pattern = r'function generateFinalText\(data\) \{.*?\n        \}'
match = re.search(pattern, text, re.DOTALL)
if match:
    text = text[:match.start()] + new_func + text[match.end():]
    print('Replaced generateFinalText successfully')
else:
    print('ERROR: Function not found in file')

open(path, 'wb').write(text.encode('utf-8'))
print('File saved without BOM, as plain UTF-8')
