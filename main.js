let poleznostChart = null;
let DovolnostChart = null;
let UdovletvoronostChart = null;


async function process() {
    let r = await fetch("/data.json");
    let data = await r.json();
    
    let mappedData = data.map(item => {
        return item['Насколько курс был полезен?'];
    })

    let uniqueValues = [...new Set(mappedData)]

    let select = document.querySelector("#selectPoleznost");

    uniqueValues.forEach(item => {
        let option = document.createElement("option"); 

        option.value = item; 
        option.text = item;

        select.add(option) 
    })

    //----------------------

    mappedData = data.map(item => {
        return item['Насколько доволен форматом обучения?'];
    })

    uniqueValues = [...new Set(mappedData)]

    select = document.querySelector("#selectDovolnost");

    uniqueValues.forEach(item => {
        let option = document.createElement("option"); 

        option.value = item; 
        option.text = item;

        select.add(option) 
    })

    //----------------------------

    mappedData = data.map(item => {
        return item['Отметь, в какой мере ты удовлетворен курсом?'];
    })

    uniqueValues = [...new Set(mappedData)]

    select = document.querySelector("#selectUdovletvoronost");

    uniqueValues.forEach(item => {
        let option = document.createElement("option"); 

        option.value = item; 
        option.text = item;

        select.add(option) 
    })
}

async function processFilter() {
    let r = await fetch("/data.json");
    let data = await r.json();
    console.log(data);

    let filteredData = data.filter(item => item["Насколько курс был полезен?"] == "Полезный")
    console.log(filteredData);
}

async function onSelectChanged(coolSelect) {
    let selectPoleznost = document.querySelector(coolSelect)
    console.log(selectPoleznost.value)
    updating()
}

async function updating() {
    let r = await fetch("/data.json");
    let data = await r.json();
    let container = document.querySelector("#elements-container > tbody");

    let selectPoleznost = document.querySelector("#selectPoleznost");
    let selectDovolnost = document.querySelector("#selectDovolnost");
    let selectUdovletvoronost = document.querySelector("#selectUdovletvoronost");

    let filteredData = data.filter(item => {
        return (selectPoleznost.value == 'не важно' || item['Насколько курс был полезен?'] == selectPoleznost.value) &&
               (selectDovolnost.value == 'не важно' || item['Насколько доволен форматом обучения?'] == selectDovolnost.value) &&
               (selectUdovletvoronost.value == 'не важно' || item['Отметь, в какой мере ты удовлетворен курсом?'] == selectUdovletvoronost.value)
    });

    container.replaceChildren();

    let poleznost = filteredData.map(item => item['Насколько курс был полезен?']);

    let poleznostCounters = {}
    poleznost.forEach(item => { 
        poleznostCounters[item] = (poleznostCounters[item] | 0) + 1
    })
    let poleznostStatsNode = document.querySelector("#poleznostStats .stats")
    poleznostStatsNode.innerText = JSON.stringify(poleznostCounters);

    let labels1 = Object.keys(poleznostCounters)
    let values1 = Object.values(poleznostCounters)
    poleznostChart.data.labels = labels1 // передали ось X
    poleznostChart.data.datasets = [{
        label: 'количество голосов',
        data: values1, // передали ось Y
    }]
    poleznostChart.update(); // перерисовали график

    //-------------------------------------------------------

    let Dovolnost = filteredData.map(item => item['Насколько доволен форматом обучения?']);

    let DovolnostCounters = {}
    Dovolnost.forEach(item => { 
        DovolnostCounters[item] = (DovolnostCounters[item] | 0) + 1
    })
    let DovolnostStatsNode = document.querySelector("#DovolnostStats .stats")
    DovolnostStatsNode.innerText = JSON.stringify(DovolnostCounters);

    let labels2 = Object.keys(DovolnostCounters)
    let values2 = Object.values(DovolnostCounters)
    DovolnostChart.data.labels = labels2 // передали ось X
    DovolnostChart.data.datasets = [{
        label: 'количество голосов',
        data: values2, // передали ось Y
    }]
    DovolnostChart.update(); // перерисовали график
 
    //---------------------------------------------------------

    let Udovletvoronost = filteredData.map(item => item['Отметь, в какой мере ты удовлетворен курсом?']);

    let UdovletvoronostCounters = {}
    Udovletvoronost.forEach(item => { 
        UdovletvoronostCounters[item] = (UdovletvoronostCounters[item] | 0) + 1
    })
    let UdovletvoronostStatsNode = document.querySelector("#UdovletvoronostStats .stats")
    UdovletvoronostStatsNode.innerText = JSON.stringify(UdovletvoronostCounters);

    let labels3 = Object.keys(UdovletvoronostCounters)
    let values3 = Object.values(UdovletvoronostCounters)
    UdovletvoronostChart.data.labels = labels3 // передали ось X
    UdovletvoronostChart.data.datasets = [{
        label: 'количество голосов',
        data: values3, // передали ось Y
    }]
    UdovletvoronostChart.update(); // перерисовали график

    filteredData.forEach(item => {
        container.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${item['ID']}</td>
            <td>${item['Насколько курс был полезен?']}</td>
            <td>${item['Насколько доволен форматом обучения?']}</td>
            <td>${item['Отметь, в какой мере ты удовлетворен курсом?']}</td>
        </tr>
        `);
    });
}

async function createChart() {
    // взяли контейнер для графика
    const chartContainer1 = document.querySelector("#chartFirst");
    const chartContainer2 = document.querySelector('#chartSecond');
    const chartContainer3 = document.querySelector('#chartThird');

    // создали график 
    poleznostChart = new Chart(chartContainer1, {
      type: 'bar', // bar -- значит гистограмма
      options: {
        maintainAspectRatio: false
      }
    });

    DovolnostChart = new Chart(chartContainer2, {
        type: 'bar', // bar -- значит гистограмма
        options: {
          maintainAspectRatio: false
        }
    });

    UdovletvoronostChart = new Chart(chartContainer3, {
        type: 'bar', // bar -- значит гистограмма
        options: {
            maintainAspectRatio: false
        }
    });
}

process();
processFilter();
updating();
createChart();