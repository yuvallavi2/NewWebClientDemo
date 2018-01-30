import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TaskMagicService} from "../services/task.magics.service";
import {isNullOrUndefined, isUndefined} from "util";
import {ControlMetadata, HtmlProperties} from "../controls.metadata.model";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';

import {CommandType} from "./enums";
import {GuiCommand} from "./gui.command";
import {MagicDirectiveDirective} from "./magic-directive.directive";
import {ComponentListBase} from '../../../ComponentListBase';


@Component({
  selector: 'task-magic',
  providers: [TaskMagicService]
})

export abstract class BaseTaskMagicComponent implements OnInit, OnDestroy {

  @Input() subformName: string;
  @Input() parentId: string;
  @Input() myTaskId: string;
  @Input() taskDescription: string;
  @ViewChildren(MagicDirectiveDirective) inFinder1: QueryList<MagicDirectiveDirective>;
  subformsDict: { [x: string]: SubformDefinition } = {};
  emptyComp: Component;

  refreshUI: Subject<any> = new Subject();
  private _controlProperties: any;
  protected getvalueCallback = (rowId: string, controlKey: string) => {
    let result = this.task.getFormControl(rowId, controlKey);
    if (!isNullOrUndefined(result))
      return result.value;
  };

  constructor(protected ref: ChangeDetectorRef,
              protected task: TaskMagicService,
              //protected magic:MagicEngine

  ) {
    this.task.Records.createFirst();

    // debugger;
  }

  get controlProperties(): any {
    return this._controlProperties;
  }

  set controlProperties(value: any) {
    this._controlProperties = value;
  }

  get table() {
    return this.task.rows;
  }

  get record() {
    return this.task.ScreenModeControls;
  }

  get taskId() {
    return this.task.taskId;
  }

  get screenFormGroup(): FormGroup {
    return this.record;
  }

  ngOnDestroy(): void {
    this.refreshUI.complete();
    this.task.refreshDom.complete();
  }
  public static componentListBase:ComponentListBase;

  getComp(subformName: string): Component {
    if (subformName in this.subformsDict) {
      let formName: string = this.subformsDict[subformName].formName;
      return BaseTaskMagicComponent.componentListBase.getComponents(formName);
    }
    else
      return this.emptyComp;
  }

  getParameters(subformName: string): any {
    if (subformName in this.subformsDict) {
      return this.subformsDict[subformName].parameters;
    }
    else
      return "";

  }

  addSubformComp(subformControlName: string, formName: string, taskId: string, taskDescription: string) {
    this.subformsDict[subformControlName] = {
      formName,
      parameters: {myTaskId: taskId, taskDescription: taskDescription}
    };
    this.ref.detectChanges();
  }


  ngOnInit() {
    let obj: any;

    if (this.task.IsStub()) {
      this.loadData();
    }
    else {
      if (isUndefined(this.myTaskId)) {
        obj = JSON.parse(this.task.getTaskId(this.parentId, this.subformName));
        this.task.taskId = obj.TaskId;
        this.task.settemplate(obj.Names);
      }
      else {
        this.task.taskId = this.myTaskId;
        obj = JSON.parse(this.taskDescription);
        this.task.settemplate(obj);
      }
    }
    this.task.buildScreenModeControls();
    this.task.registerGetValueCallback(this.getvalueCallback);
    this.task.initTask();
    this.regUpdatesUI();
  }

  getFormGroupByRow(id: string): FormGroup {
    return this.task.rows[id];
  }

  ifRowCreated(id: string): boolean {
    let result = this.getFormGroupByRow(id);
    return !isNullOrUndefined(result);
  }

  executeCommand(command: GuiCommand): void {
    let rowId: string = (command.line || 0).toString();
    let controlId = command.CtrlName;

    switch (command.CommandType) {
      case CommandType.REFRESH_TASK:

        this.task.ScreenModeControls.patchValue(this.task.ScreenControlsData.Values);
        this.ref.detectChanges();
        break;
      case CommandType.SET_TABLE_ITEMS_COUNT:
        if (!isUndefined(command.number))
          this.task.updateTableSize(command.number);
        this.ref.detectChanges();
        break;

      case CommandType.SET_PROPERTY:
        let properties: ControlMetadata;
        properties = this.task.Records.list[rowId].getControlMetadata(controlId);
        if (command.Operation == HtmlProperties.ItemsList) {
          // noinspection UnnecessaryLocalVariableJS
          const obj = JSON.parse(command.str);
          properties.properties[command.Operation] = obj;
        }
        else
          properties.properties[command.Operation] = command.str;

        break;
      case CommandType.SET_CLASS:
        properties = this.task.Records.list[rowId].getControlMetadata(controlId);
        properties.setClass(command.Operation, command.str);
        break;

      case CommandType.SET_STYLE:
        properties = this.task.Records.list[rowId].getControlMetadata(controlId);
        properties.setStyle(command.Operation, command.str);
        break;

      case  CommandType.SET_VALUE:
        this.task.Records.list[rowId].values[controlId] = command.str;
        let c = this.task.getFormControl(rowId, controlId);
        if (!isNullOrUndefined(c))
          c.setValue(command.str);

        break;
    }
  }

  regUpdatesUI() {
    this.task
      .refreshDom
      .filter(updates => updates.TaskTag == this.taskId)
      .subscribe(command => {
        this.executeCommand(command)
      });
  }


  gettext(controlId, rowId?) {
    return this.task.getProperty(controlId, HtmlProperties.Text, rowId);
  }

  getImage(controlId, rowId?) {
    let result = this.task.getProperty(controlId, HtmlProperties.Image, rowId);
    return result;

  }

  isImageExists(controlId, rowId?): boolean {
    let result = this.task.getProperty(controlId, HtmlProperties.Image, rowId);
    return !isNullOrUndefined(result);

  }

  getClasses(controlId, rowId?) {
    //return 'one two ';
    return this.task.getClasses(controlId, rowId);
  }

  getStyle(controlId: string, styleName:string, rowId?) {
    //return 'one two ';
    let style = this.task.getStyle(controlId, styleName, rowId)
    return style;
  }

  getVisible(controlId, rowId?) {
    let vis: Boolean = this.getProperty(controlId, HtmlProperties.Visible, rowId) == true;
    return vis ? 'visible' : 'hidden';
  }

  getEnable(controlId, rowId?) {
    let result = this.getProperty(controlId, HtmlProperties.Enabled, rowId) == true;
    return result;
  }

  isRowSelected(controlId, rowId?) {
    let selectedRow = this.getProperty(controlId, HtmlProperties.SelectedRow, "0") ;
    return selectedRow == rowId;
  }

  isDisabled(controlId, rowId?) {
    let result = this.getProperty(controlId, HtmlProperties.Enabled, rowId);
    return result == 1 ? null : true;
  }

  getProperty(controlId: string, prop: HtmlProperties, rowId?: string) {
    return this.task.getProperty(controlId, prop, rowId);
  }

  getTitle(controlId, rowId?) {
    return this.task.getProperty(controlId, HtmlProperties.Tooltip, rowId);
  }

  getSelectedValue(controlId, rowId?) {
    return this.task.getProperty(controlId, HtmlProperties.SelectedValue, rowId);
  }

  getPlaceholder(controlId, rowId?) {
    return this.task.getProperty(controlId, HtmlProperties.PlaceHolder, rowId);
  }

  getType(controlId, rowId?) {
    return this.task.getProperty(controlId, HtmlProperties.Password, rowId) ? "password" : "text";
  }

  getTabIndex(controlId, rowId?) {
    return this.task.getProperty(controlId, HtmlProperties.TabIndex, rowId);
  }


  getValue(controlId, rowId?) {
    let val = this.task.getValue(controlId, rowId);
    return val;
  }

  getListboxValues(id) {
    return this.getProperty(id, HtmlProperties.ItemsList);
  }

  public onselectionchanged(event: Event, idx: string) {
    this.task.insertEvent('selectionchanged', idx, (<any>(event.target)).selectedIndex.toString());
  }

  oncheckchanged(event: Event, idx: string) {
    this.task.insertEvent('selectionchanged', idx, (<any>(event.target)).checked ? "1" : "0");
  }
  jsonData :string
  public createData()
  {

    this.task.createData();

  }

  public loadData()
  {
    alert('Please, overwrite method loadData');
  }

  public loadStubData(stubData: any)
  {

    this.task.Records = stubData.records;
    this.task.settemplate(stubData.template);
    this.task.taskId = "1";
    for (let i = 0; i < this.task.Records.list.length; i++)
      this.task.buildTableRowControls(i);
  }
}

interface SubformDefinition {
  formName: string;
  parameters: any;
}
