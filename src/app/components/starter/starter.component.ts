import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-starter',
    templateUrl: './starter.component.html',
    styleUrls: ['./starter.component.scss']
})
export class StarterComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit(): void { }

    showMore = () => window.location.href = '#content';
}
