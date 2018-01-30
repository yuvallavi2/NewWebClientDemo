import { ComponentListBase } from "./ComponentListBase";
import { Component } from "@angular/core";

import { SpaContainer } from "./SpaContainer/SpaContainer.component";

import { YourTravel } from "./YourTravel/YourTravel.component";

import { YourTravel } from "./YourTravel/YourTravel.component";

export class ComponentsList extends ComponentListBase {
	static compHash: { [x: string]: any } = {
		SpaContainer: SpaContainer,

		YourTravel: YourTravel,

		YourTravel: YourTravel
	};

	static ComponentArray: any[] = [SpaContainer, YourTravel, YourTravel];

	static getArray() {
		return this.ComponentArray;
	}

	public getComponents(name: string): Component {
		return ComponentsList.compHash[name];
	}

	public static getAllComponents() {
		return this.ComponentArray;
	}
}
