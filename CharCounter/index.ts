import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class CharCounter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private textarea: HTMLTextAreaElement;
    private counter: HTMLDivElement;
    private message: HTMLDivElement;

    private notifyOutputChanged: () => void;
    private maxLength?: number;
    private isRequired: boolean = false;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {

        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;

        const attribute = context.parameters.textValue.attributes;

        this.maxLength = attribute?.MaxLength;
     

        // Create input
        this.textarea = document.createElement("textarea");
        this.textarea.style.width = "100%";
        this.textarea.style.padding = "8px";
        this.textarea.style.border = "1px solid #ccc";
        this.textarea.style.borderRadius = "4px";
        this.textarea.style.fontFamily = "Segoe UI, sans-serif";

        // Detect field type
        if (attribute?.Format === "TextArea") {
            this.textarea.rows = 4;
        } else {
            this.textarea.rows = 1;
        }

        if (this.maxLength) {
            this.textarea.maxLength = this.maxLength;
        }

        this.textarea.value = context.parameters.textValue.raw || "";

        // Counter badge
        this.counter = document.createElement("div");
        this.counter.style.marginTop = "6px";
        this.counter.style.fontSize = "12px";
        this.counter.style.display = "inline-block";
        this.counter.style.padding = "2px 8px";
        this.counter.style.borderRadius = "10px";
        this.counter.style.background = "#f3f2f1";

        // Validation message
        this.message = document.createElement("div");
        this.message.style.fontSize = "12px";
        this.message.style.marginTop = "4px";

        this.updateCounter();

        this.textarea.addEventListener("input", () => {
            this.updateCounter();
            this.notifyOutputChanged();
        });

        container.appendChild(this.textarea);
        container.appendChild(this.counter);
        container.appendChild(this.message);
    }

    private updateCounter(): void {
        const length = this.textarea.value.length;

        if (this.maxLength) {
            this.counter.innerText = `${length} / ${this.maxLength}`;

            if (length > this.maxLength) {
                this.counter.style.background = "#fde7e9";
                this.counter.style.color = "#a4262c";
                this.message.style.color = "#a4262c";
                this.message.innerText = `You exceeded the limit by ${length - this.maxLength} characters`;
            }
            else if (length > this.maxLength * 0.8) {
                this.counter.style.background = "#fff4ce";
                this.counter.style.color = "#8a6d3b";
                this.message.style.color = "#8a6d3b";
                this.message.innerText = "Approaching character limit";
            }
            else {
                this.counter.style.background = "#f3f2f1";
                this.counter.style.color = "#333";
                this.message.innerText = "";
            }
        }
        else {
            this.counter.innerText = `${length} characters`;
        }

        // Required validation
        if (this.isRequired && length === 0) {
            this.message.style.color = "#a4262c";
            this.message.innerText = "This field is required.";
        }
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const newValue = context.parameters.textValue.raw || "";

        if (newValue !== this.textarea.value) {
            this.textarea.value = newValue;
            this.updateCounter();
        }
    }

    public getOutputs(): IOutputs {
        return {
            textValue: this.textarea.value
        };
    }

    public destroy(): void {
        // Cleanup if needed
    }
}