import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  // Check if icon has color or assign currentColor
  @Input() color = 'currentColor';
  @Input() fill = 'primary';
  @HostBinding('class') @Input() size = 'medium';

  /**
   * Get icon name
   */

  @Input() name: string | undefined;

  /**
   * Svg-icon aria lable
   */
  @Input() label: string | undefined;

  constructor() {}

  ngOnInit(): void {
    const svg = document.getElementById('check');
    svg?.classList.add('progress');
    setInterval(() => {
      svg?.classList.remove('progress')
      svg?.classList.add('ready')
    }, 1000);
  }
}
