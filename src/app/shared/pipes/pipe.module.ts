import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { FilterPipe } from './filter.pipe';
import { SearchPipe } from './search.pipe';
import { ShortNamePipe } from './short-name.pipe';
import { SafeHtmlPipe } from './safeHtml.pipe';

@NgModule({
  declarations: [FilterPipe, SearchPipe, ShortNamePipe, SafeHtmlPipe],
  imports: [CommonModule],
  exports: [FilterPipe, SearchPipe, ShortNamePipe, SafeHtmlPipe]
})

export class PipeModule { }
