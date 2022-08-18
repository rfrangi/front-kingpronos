import {animate, stagger, animateChild, group, query, style, transition, trigger} from '@angular/animations';

export const FADE_IN_GROW = [
  trigger('fadeInGrow', [
    transition(':enter', [
      query(':enter', [
        style({ opacity: 0 }),
        stagger('250ms', [
          animate('1500ms', style({ opacity: 1 }))
        ])
      ])
    ])
  ])
];

export const animateRight = [
  style({ position: 'relative' }),
  query(':enter, :leave', [
    style({
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100%'
    })
  ]),
  query(':enter', [
    style({ right: '-100%'})
  ]),
  query(':leave', animateChild()),
  group([
    query(':leave', [
      animate('400ms ease-out', style({ right: '100%'}))
    ]),
    query(':enter', [
      animate('400ms ease-out', style({ right: '0%'}))
    ])
  ]),
  query(':enter', animateChild()),
];

export const animateLeft = [
  style({ position: 'relative' }),
  query(':enter, :leave', [
    style({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%'
    })
  ]),
  query(':enter', [
    style({ left: '-100%'})
  ]),
  query(':leave', animateChild()),
  group([
    query(':leave', [
      animate('400ms ease-out', style({ left: '100%'}))
    ]),
    query(':enter', [
      animate('400ms ease-out', style({ left: '0%'}))
    ])
  ]),
  query(':enter', animateChild()),
];


export const slideInAnimation =
  trigger('routeAnimations', [

    transition('loginPage => forgotPasswordPage', animateRight),
    transition('forgotPasswordPage => loginPage', animateLeft),
    transition('loginPage => signupPage', animateLeft),
    transition('signupPage => loginPage', animateRight),
    transition('loginPage => homePage', animateLeft),
    transition('homePage => loginPage', animateRight),

    transition('homePage => accountPage', animateRight),
    transition('homePage => abonnementsPage', animateRight),
    transition('homePage => conversationsPage', animateRight),
    transition('homePage => bilanPage', animateRight),
    transition('homePage => supportPage', animateRight),

    transition('accountPage => homePage', animateRight),
    transition('accountPage => abonnementsPage', animateRight),
    transition('accountPage => conversationsPage', animateRight),
    transition('accountPage => bilanPage', animateRight),
    transition('accountPage => supportPage', animateRight),

    transition('abonnementsPage => accountPage', animateLeft),
    transition('abonnementsPage => homePage', animateRight),
    transition('abonnementsPage => conversationsPage', animateRight),
    transition('abonnementsPage => bilanPage', animateRight),
    transition('abonnementsPage => paiementPage', animateRight),
    transition('abonnementsPage => supportPage', animateRight),

    transition('paiementPage => accountPage', animateLeft),
    transition('paiementPage => homePage', animateRight),
    transition('paiementPage => conversationsPage', animateRight),
    transition('paiementPage => bilanPage', animateRight),
    transition('paiementPage => supportPage', animateLeft),
    transition('paiementPage => abonnementsPage', animateLeft),

    transition('conversationsPage => accountPage', animateLeft),
    transition('conversationsPage => homePage', animateLeft),
    transition('conversationsPage => abonnementsPage', animateLeft),
    transition('conversationsPage => bilanPage', animateRight),
    transition('conversationsPage => supportPage', animateRight),

    transition('bilanPage => accountPage', animateLeft),
    transition('bilanPage => homePage', animateLeft),
    transition('bilanPage => abonnementsPage', animateLeft),
    transition('bilanPage => conversationsPage', animateLeft),
    transition('bilanPage => supportPage', animateRight),

    transition('supportPage => bilanPage', animateLeft),
    transition('supportPage => conversationsPage', animateLeft),
    transition('supportPage => abonnementsPage', animateRight),
    transition('supportPage => accountPage', animateRight),
    transition('supportPage => homePage', animateRight),


    transition('gestionPronoPage => addPronoPage', animateRight),
    transition('gestionPronoPage => updatePronoPage', animateRight),


  ]);
