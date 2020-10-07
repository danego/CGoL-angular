import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'cgol-angular';

  constructor() {}

  ngOnInit() {
    //note - this scroll and timeout feature modified off of Chris Ferdinandi's blog, 'Go Make Things'
    let isScrolling;
    const screenRefreshrateMS = 66;

    window.addEventListener('scroll', function(event) {
      window.clearTimeout(isScrolling);

      isScrolling = window.setTimeout(function() {
        //Use only pageYOffset ... don't need to know scrollDelta, only finalScrollPosition
        let end = window.pageYOffset;

        if(end > 500) {
          window.history.replaceState({}, 'landing', '/main');
        }
        else if (end < 300){
          window.history.replaceState({}, 'landing', '/landing');
        }
      }, screenRefreshrateMS)
    });
  }
}
