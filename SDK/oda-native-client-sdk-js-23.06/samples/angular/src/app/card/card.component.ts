import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Action, CardPayload } from '@oda-web-sdk/oda-core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  imports: [CommonModule]
})
export class CardComponent implements OnInit {

  @Input() messagePayload: CardPayload | undefined;
  @Output() cardEvent = new EventEmitter<Action>();

  constructor() { }

  ngOnInit(): void {
  }

  onActionClick(action: Action) {
    this.cardEvent.emit(action);
  }

}
