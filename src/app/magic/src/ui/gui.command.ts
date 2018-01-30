import {CommandType, WindowType} from "./enums";

export class GuiCommand {
  public CommandType: CommandType;
  public TaskTag: string; // should we use window id?
  public Operation: string;
  public Bool1: boolean;
  public Bool3: boolean;
  public ByteArray: number[];
  public CtrlName: string;

  //public CtrlsList: List<GuiMgControl>;
  public fileName: String;
  public height: number;
  public intArray: number[];
  //public intArrayList: List<number[]>;
  //public intList: List<number>;
  public itemsList: String[];
  public layer: number;
  public line: number;
  // public menu: GuiMgMenu;
  // public menuEntry: GuiMenuEntry;
  // public menuStyle: MenuStyle;
  // public mgColor: MgColor;
  // public mgColor1: MgColor;
  // public mgFont: MgFont;
  public number: number;
  public number1: number;
  public number2: number;

  public obj: Object;
  public parentObject: Object;
  public obj1: Object;
  public str: string;
  public stringList: String[];
  public style: number;
  public width: number;
  public windowType: WindowType;
  public x: number;
  public y: number;
  public userDropFormat: String;
  public isHelpWindow: boolean;
  public isParentHelpWindow: boolean;
  public runtimeDesignerXDiff: number;
  public runtimeDesignerYDiff: number;
  public createInternalFormForMDI: boolean;
}

/**
 * Created by rinav on 03/09/2017.
 */
