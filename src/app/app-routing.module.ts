import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from './services/authorization.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [AuthorizationGuard] },
    // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthorizationGuard] },
    // { path: 'detail/:id', component: UserDetailComponent, canActivate: [AuthorizationGuard] },
    // { path: 'users', component: UsersComponent, canActivate: [AuthorizationGuard] },
    { path: 'unauthorized', component: UnauthorizedComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
