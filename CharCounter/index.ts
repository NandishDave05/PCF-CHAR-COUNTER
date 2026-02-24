import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class CharCounter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private textarea: HTMLTextAreaElement;
    private counter: HTMLDivElement;
    private context: ComponentFramework.Context<IInputs>;
    private notifyOutputChanged: () => void;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {

        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;

        // Create textarea
        this.textarea = document.createElement("textarea");
        this.textarea.style.width = "100%";
        this.textarea.style.minHeight = "80px";

        this.textarea.value = context.parameters.textValue.raw || "";

        // Create counter
        this.counter = document.createElement("div");
        this.counter.style.marginTop = "4px";
        this.counter.style.fontSize = "12px";
        this.counter.style.color = "#666";

        this.updateCounter();

        // On input change
        this.textarea.addEventListener("input", () => {
            this.updateCounter();
            this.notifyOutputChanged();
        });

        this.container.appendChild(this.textarea);
        this.container.appendChild(this.counter);
    }

    private updateCounter(): void {
        const length = this.textarea.value.length;
        this.counter.innerText = `${length} characters`;
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
