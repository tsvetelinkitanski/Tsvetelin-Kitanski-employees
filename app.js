const root = document.getElementById("root");
let table = document.getElementById('table_data')

const projectId = '';

let finalResult = {};

const uploadconfirm = document
    .getElementById("uploadconfirm")
    .addEventListener("click", () => {
        Papa.parse(document.getElementById("uploadfile").files[0], {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (result) {

                const data = result.data
                    .reduce((acc, currentValue) => {
                        if (!acc[currentValue.ProjectID]) {
                            acc[currentValue.ProjectID] = [currentValue];
                        } else {
                            acc[currentValue.ProjectID].push(currentValue)
                        }
                        return acc;
                    }, {});

                let days = 0;
                const pairsEmployee = Object.values(data)
                    .filter(pair => pair.length == 2)
                    .forEach(x => {
                        let curentFirstEmployee = x[0].EmpID
                        let currentSecondEmployee = x[1].EmpID
                        x.map(x => {

                            const startDate = x.DateFrom;
                            let endDate = '';
                            if (x.DateTo === 'NULL') {
                                let today = new Date();
                                const dd = String(today.getDate()).padStart(2, '0');
                                const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                const yyyy = today.getFullYear();

                                // 2012-05-16
                                today = yyyy + '-' + mm + '-' + dd;
                                endDate = today;

                            } else {
                                endDate = x.DateTo;
                            }
                            const d1 = new Date(startDate);
                            const d2 = new Date(endDate);
                            const diff = Math.abs(d1 - d2);
                            const currentDiffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

                            if (Number(currentDiffDays) > days) {
                                days = Number(currentDiffDays)
                                finalResult = {
                                    firstEmployee: curentFirstEmployee,
                                    secondEmployee: currentSecondEmployee,
                                    projectId: x.ProjectID,
                                    daysWorked: days,
                                }
                            }

                            return finalResult;
                        })
                    })

                let trElement = document.createElement('tr');
                trElement.innerHTML =
                `<td> ${finalResult.firstEmployee}</td>
                <td> ${finalResult.secondEmployee}</td>
                <td> ${finalResult.projectId}</td>
                <td> ${finalResult.daysWorked}</td>`;

                table.appendChild(trElement);
            },

        });
    }); 