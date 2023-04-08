// Паттерн може бути використаний для відокремлення окремих компонентів в рамках одного застосунку
// Будь-який компонент може реагувати на будь-яку подію без додаткового зв'язку з іншими компонентами.
// Необхідно просто бути підписаним на Event Bus.

class EventBus {
    constructor() {
        this.eventObject = {};
        this.callbackId = 0;
    }

    publish(eventName, ...args) {
        const callbackObject = this.eventObject[eventName];

        if (!callbackObject) {
            return console.warn(eventName + " not found!");
        }

        for (let id in callbackObject) {
            callbackObject[id](...args);

            if (id[0] === "d") {
                delete callbackObject[id];
            }
        }
    }

    subscribe(eventName, callback) {
        if (!this.eventObject[eventName]) {
            console.log(eventName, 'EVENT_NAME');
            this.eventObject[eventName] = {};
        }

        const id = this.callbackId++;
        this.eventObject[eventName][id] = callback;

        const unSubscribe = () => {
            delete this.eventObject[eventName][id];
            if (Object.keys(this.eventObject[eventName]).length === 0) {
                delete this.eventObject[eventName];
            }
        };

        return { unSubscribe };
    }

    subscribeOnce(eventName, callback) {
        if (!this.eventObject[eventName]) {
            this.eventObject[eventName] = {};
        }

        const id = "d" + this.callbackId++;
        this.eventObject[eventName][id] = callback;

        const unSubscribe = () => {
            delete this.eventObject[eventName][id];
            if (Object.keys(this.eventObject[eventName]).length === 0) {
                delete this.eventObject[eventName];
            }
        };

        return { unSubscribe };
    }


    getList() {
        console.log(this.eventObject);
    }
}


// Subscribe to event eventX
eventBus.subscribe("eventX", (obj, num) => {
    console.log("Module A", obj, num);
  });
  eventBus.subscribe("eventX", (obj, num) => {
    console.log("Module B", obj, num);
  });
  eventBus.subscribe("eventX", (obj, num) => {
    console.log("Module C", obj, num);
  });
  
  // publish event eventX
  eventBus.publish("eventX", { msg: "EventX published!" }, 1);
  
  // output
  // > Module A {msg: 'EventX published!'} 1
  // > Module B {msg: 'EventX published!'} 1
  // > Module C {msg: 'EventX published!'} 1

const eventBus = new EventBus();
const addInput = document.querySelector('.add-input')
const publishInput = document.querySelector('.publish-input')

document.querySelector('.add').addEventListener('click', () => {
    eventBus.subscribe(addInput.value, (obj, num) => {
        console.log(addInput.value, obj, num);
    });
})
document.querySelector('.publish').addEventListener('click', () => {
    eventBus.publish(publishInput.value, { msg: publishInput.value + " published!" }, 1);
})

document.querySelector('.get-list').addEventListener('click', () => {
    eventBus.getList()
})

// start HTML CODE FOR TEST //
// <input class='add-input' type="text"><button class="add">Add new event</button>
// <br>
// <input class="publish-input" type="text"><button class="publish">Publish</button>
// <br>
// <button class="get-list">Get subscription</button>
// end HTML CODE FOR TEST //