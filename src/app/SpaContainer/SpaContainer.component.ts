import { Component } from "@angular/core";
import { BaseTaskMagicComponent } from "../magic/src/ui/app.baseMagicComponent";
import { TaskMagicService } from "../magic/src/services/task.magics.service";

@Component({
	selector: "mga-SpaContainer",
	providers: [TaskMagicService],
	styleUrls: ["./SpaContainer.component.css"],
	templateUrl: "./SpaContainer.component.html"
})
export class SpaContainer extends BaseTaskMagicComponent {}
