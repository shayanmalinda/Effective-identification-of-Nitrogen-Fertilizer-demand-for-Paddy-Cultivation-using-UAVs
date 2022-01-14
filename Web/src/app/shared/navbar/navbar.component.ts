import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    type: any;


    constructor(public location: Location, private element: ElementRef, private router: Router) {

        this.sidebarVisible = false;
   
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');

        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/home') {
            return true;
        }
        else {
            return false;
        }
    }

    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/documentation') {
            return true;
        }
        else {
            return false;
        }
    };

    isUserProfile() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/user-profile') {
            return true;
        }
        else {
            return false;
        }
    };

    isLogin() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/login') {
            return true;
        }
        else {
            return false;
        }
    };

    isSignUp() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/signup') {
            return true;
        }
        else {
            return false;
        }
    };
    isAdminPages() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/admin-dashboard') {
            return true;
        }
       
        else {
            return false;
        }
    };

    isRelevantPages() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/user-dashboard') {
            return true;
        }
        if (titlee === '/lcc-details') {
            return true;
        }
        if (titlee === '/updateuser') {
            return true;
        }
        else {
            return false;
        }
    };

    isRelevantDashPages() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee === '/user-farmers') {
            return true;
        }
        if (titlee === '/user-farmer-requests') {
            return true;
        }
        if (titlee === '/user-fields') {
            return true;
        }
        if (titlee === '/user-field-visits') {
            return true;
        }
        if (titlee === '/user-field-history') {
            return true;
        }
        if (titlee === '/user-upload-images') {
            return true;
        }
        if (titlee === '/user-view-map') {
            return true;
        }
        else {
            return false;
        }
    };
    viewProfile() {
        console.log(this.type)
        this.router.navigate(['/admin-profile'], { state: { type: 'admin' } });
    }
    isReport() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        } if (titlee === '/user-reports') {
            return true;
        } else if (titlee === '/division-report') {// admin reports
            this.type = 'admin';
            return true;
        } if (titlee === '/user-reports-farmers') {
            return true;
        } if (titlee === '/user-reports-fields') {
            return true;
        } if (titlee === '/user-reports-requests') {
            return true;
        } if (titlee === '/user-reports-visits') {
            return true;
        }
    }


    printClick() {
        console.log("print Click !!!");
        window.print();
    }

    onLccReportClick() {
        console.log("lcc clicked");
        this.router.navigate(['/user-reports'], { state: { type: "lcc" } });
    }

    onFarmersReportClick() {
        console.log("farmers clicked");
        this.router.navigate(['/user-reports-farmers']);
    }

    onRequestsReportClick() {
        console.log("requests clicked");
        this.router.navigate(['/user-reports-requests']);
    }

    onFieldsReportClick() {
        console.log("fields clicked");
        this.router.navigate(['/user-reports-fields']);
    }

    onVisitsReportClick() {
        console.log("visits clicked");
        this.router.navigate(['/user-reports-visits']);
    }


}
