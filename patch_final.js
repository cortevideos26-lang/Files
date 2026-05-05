        function applyFilters() {
            const queryRaw = document.getElementById("filterBusca").value.toLowerCase();
            const query = queryRaw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const fonte = document.getElementById("filterFonte").value;
            const cargoFiltro = document.getElementById("filterCargo") ? document.getElementById("filterCargo").value : "";
            const uf = document.getElementById("filterUF").value.toUpperCase();
            const banco = document.getElementById("filterBanco").value;
            const rendaMin = parseFloat(document.getElementById("filterRendaMin").value) || 0;
            const rendaMax = parseFloat(document.getElementById("filterRendaMax").value) || Infinity;

            window.filteredDataArray = window.processedDataArray.filter(data => {
                const nomeNormalizado = (data.nome || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const searchMatch = nomeNormalizado.includes(query) ||
                    (data.cpf && data.cpf.replace(/\D/g, "").includes(query.replace(/\D/g, "")));

                const fonteMatch = fonte === "" ||
                    (fonte === "SIAPE" && data.isSiape) ||
                    (fonte === "INSS" && !data.isSiape);

                let cargoMatch = true;
                if (cargoFiltro !== "") {
                    if (data.isSiape) {
                        cargoMatch = (data.cargo || "").toUpperCase().includes(cargoFiltro);
                    } else {
                        cargoMatch = false;
                    }
                }

                const ufMatch = uf === "" || (data.ufRaw || "").toUpperCase() === uf;
                const bancoMatch = banco === "" || (data.banco || "").trim() === banco;
                const rendaMatch = data.valorRaw >= rendaMin && data.valorRaw <= rendaMax;

                return searchMatch && fonteMatch && cargoMatch && ufMatch && bancoMatch && rendaMatch;
            });

            updateDashboardStats();
            currentPage = 1;
            renderPage(currentPage);
        }