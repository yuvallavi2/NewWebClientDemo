import {Directive, ElementRef, Input, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {TaskMagicService} from "../services/task.magics.service";
import {GuiCommand} from "./gui.command";
import {CommandType} from "./enums";
import {BaseTaskMagicComponent} from "./app.baseMagicComponent";
import {isNullOrUndefined} from "util";

@Directive({
  selector: '[magic]'
})
export class MagicDirectiveDirective implements OnInit {


  @Input('magic') id: string;
  @Input() rowId: string;
  @Input() events: any[] = [];
  htmlElement: HTMLElement;
  component: BaseTaskMagicComponent;
  eventHandlers: { [key: string]: () => void; } = {};

  constructor(private element: ElementRef,
              private renderer: Renderer2,
              private _task: TaskMagicService,
              private vcRef: ViewContainerRef,) {

    this.htmlElement = this.element.nativeElement;
    this.component = (<any>this.vcRef)._view.component as BaseTaskMagicComponent;
  }

  get task() {
    return this._task;
  }

  regEvents() {
    // Handle events for which event handler may be removed and restored
    this.eventHandlers['focus'] = this.OnFocus.bind(this);

    Object.keys(this.eventHandlers).forEach((key) => {
      this.htmlElement.addEventListener(key, this.eventHandlers[key]);
    });


    // Handle events with anonymous  event handlers
    let events: string[] = ['click', 'dblclick',];// 'mouseenter', 'mouseleave','resize', 'load', 'unload',
    events.forEach(event => {
      this.htmlElement.addEventListener(event, (e) => {
        this.task.insertEvent(event, this.id, this.rowId);
      });
    });
  }

  OnFocus() {
    this.task.insertEvent('focus', this.id, this.rowId);
  }


  regUpdatesUI() {
    this.task
      .refreshDom
      .filter(updates => updates.CtrlName == this.id &&
        (((!isNullOrUndefined(updates.line))
          && updates.line.toString() == this.rowId) ||
          ( isNullOrUndefined(updates.line) && (this.rowId == "0" || isNullOrUndefined(this.rowId) ))))
      .subscribe(a => {
          let command: GuiCommand = a;
          if (isNullOrUndefined(this.rowId))
            this.rowId = '0';
          try {
            this.handleCommand(command);
          }
          catch (ex) {
            console.dir(ex);
          }
        }
      );

  }

  ngOnInit(): void {
    //this.htmlElement.id = this.id;
    this.regEvents();
    this.regUpdatesUI();
  }

  private handleCommand(command: GuiCommand) {
    switch (command.CommandType) {
      // case CommandType.SET_PROPERTY:
      // case  CommandType.SET_VALUE:
      // case CommandType.SET_CLASS:
      //   break;
      case CommandType.SET_ATTRIBITE:
        if (command.str != "true")
          this.renderer.removeAttribute(this.htmlElement, command.Operation);
        else
          this.renderer.setAttribute(this.htmlElement, command.Operation, command.str);

        break;

      case CommandType.CREATE_SUB_FORM:
        this.component.addSubformComp(command.CtrlName, command.userDropFormat.toString(), command.str, command.fileName.toString());
        break;

      case CommandType.SET_FOCUS:
        this.htmlElement.removeEventListener('focus', this.eventHandlers['focus']);
        this.htmlElement.focus();
        this.htmlElement.addEventListener('focus', this.eventHandlers['focus']);
        break;
    }
  }

}
