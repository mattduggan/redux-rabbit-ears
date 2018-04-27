function createMessage(message) {
    return { type: 'MESSAGE', payload: message };
}

function messages(state = [], action) {
    switch(action.type) {
        case "MESSAGE":
            return [
                ...state,
                action.payload
            ];
        default:
            return state;
    }
}

class View {
    constructor(store) {
        this.el = document.createElement('div');

        this.input = document.createElement('input');
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('placeholder', 'redux-rabbit-ears message:');

        this.button = document.createElement('input');
        this.button.setAttribute('type', 'button');
        this.button.setAttribute('value', 'Add');

        this.button.addEventListener('click', () => {
            store.dispatch(createMessage(this.input.value));
        });

        this.messages = document.createElement('ul');

        this.el.appendChild(this.input);
        this.el.appendChild(this.button);
        this.el.appendChild(this.messages);

        store.subscribe(() => {
            while (this.messages.firstChild) {
                this.messages.removeChild(this.messages.firstChild);
            }

            const fragment = document.createDocumentFragment();

            store.getState().messages.forEach((message) => {
                const item = document.createElement('li');
                const text = document.createTextNode(message);
                item.appendChild(text);
                fragment.appendChild(item);
            });

            this.messages.appendChild(fragment);
        });
    }
}

const store = Redux.createStore(
    Redux.combineReducers({ messages }),
    Redux.applyMiddleware(ReduxRabbitEars.createExtensionMiddleware('efbipeehebjmabeolkehdidjpopmnjli'))
);

const view = new View(store);
document.body.insertBefore(view.el, document.body.firstChild);
