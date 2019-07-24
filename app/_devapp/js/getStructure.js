function login() {
    return new Promise(resolve => {
        JF.login(
            function success() {
                JF.init({ access: 'full' });
                resolve(JF.getAPIKey());
            },
            function error() {
                window.alert("Could not authorize user");
            }
        )
    })
}


function getFromId() {
    return new Promise(resolve => {
        JF.FormPicker({
            multiSelect: false,
            infinite_scroll: true,
            search: true,
            onSelect: function (r) {
                resolve(r[0].id);
            }
        })
    })
}

function getStructure(formId) {
    return new Promise(resolve => {
        JF.QuestionPicker(formId, {
            sort: 'order',
            sortType: 'ASC',
            title: 'Question Picker',
            multiSelect: false,
            ignore_types: [],
            loadForm: false,
            onSelect: function (selectedQuestions) {
                let structure = selectedQuestions[0].options.split("|");
                if (selectedQuestions[0].required == "No") {
                    structure = ["Uncategorized", ...structure];
                }
                resolve({ structure, "qid": selectedQuestions[0].qid, "formId": formId })

                // const structure = selectedQuestions[0].options.split("|");
            }
        });
    })
}

async function init() {
    const apiKey = await login();
    const formId = await getFromId();
    const structure = await getStructure(formId);    

    structure["apiKey"] = apiKey;

    const xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 

    xmlhttp.onload = function() {
        const response = document.getElementById("test");
        response.innerHTML = this.responseText
    }

    // xmlhttp.onreadystatechange = () => {
    //     if (xmlhttp.readyState === 4)  {
    //         const response = xmlhttp.response;
    //         const xhr = new XMLHttpRequest();
    //         xhr.open("POST", "app/_devapp/app.js", true);
    //         xhr.setRequestHeader("Content-Type", "application/json");
    //         xhr.send(response);
    //     }
    // }

    xmlhttp.open("POST", "connect.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(structure));
}

init();