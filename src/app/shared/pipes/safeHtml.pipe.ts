import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    transform(value) {
        // return this.sanitized.bypassSecurityTrustHtml(value);
        return new DOMParser().parseFromString(value, "text/html").documentElement.textContent;
    }
    // toHTML(input) : any {
    //     return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
    // }
}