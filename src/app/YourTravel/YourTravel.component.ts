import { Component } from "@angular/core";
import { BaseTaskMagicComponent } from "../magic/src/ui/app.baseMagicComponent";
import { TaskMagicService } from "../magic/src/services/task.magics.service";

@Component({
	selector: "mga-YourTravel",
	providers: [TaskMagicService],
	styleUrls: ["./YourTravel.component.css"],
	templateUrl: "./YourTravel.component.html"
})
export class YourTravel extends BaseTaskMagicComponent {}
