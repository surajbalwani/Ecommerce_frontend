import { Routes } from '@angular/router';
import { ItemManagerComponent } from './component/item-manager/item-manager.component';

export const routes: Routes = [
    {
        path: "",
        component: ItemManagerComponent
    },
    {
        path: "item-manager",
        component: ItemManagerComponent
    }
];
