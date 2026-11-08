import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'bag'
  | 'plus'
  | 'trash'
  | 'undo'
  | 'redo'
  | 'clock'
  | 'pin'
  | 'check'
  | 'arrow-left'
  | 'settings'
  | 'list'
  | 'logout'
  | 'alert'
  | 'card'
  | 'cash'
  | 'wallet';

// Icônes SVG en trait (même épaisseur partout)
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Icon {
  name = input.required<IconName>();
  size = input<number>(20);
}
