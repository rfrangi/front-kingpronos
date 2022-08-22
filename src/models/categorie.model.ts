import {CLUBS_BASKETBALL, CLUBS_FOOTBALL, JOUEUR_TENNIS, Equipe, CLUBS_HOCHEY_GLACE} from './equipe.model';

export class Categorie {

  code!: string;
  label!: string;
  img!: string;
  urlLogoInconnu!: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  getEquipe(code: string): Equipe {
    let result = null;
    switch (this) {
      case CATEGORIES.FOOTBALL:
        result = CLUBS_FOOTBALL[code];
        break;
      case CATEGORIES.BASKETBALL:
        result = CLUBS_BASKETBALL[code];
        break;
      case CATEGORIES.TENNIS:
        result = JOUEUR_TENNIS[code];
        break;
      case CATEGORIES.HOCHEY_GLACE:
        result = CLUBS_HOCHEY_GLACE[code];
        break;
      default:
        result =  this.loadEquipeInconnu(code);
    }
    return result ? result : this.loadEquipeInconnu(code);
  }


  getEquipes(): Array<Equipe> {
    let result: Array<Equipe> = [];
    switch (this) {
      case CATEGORIES.FOOTBALL:
        result = Object.values(CLUBS_FOOTBALL);
        break;
      case CATEGORIES.BASKETBALL:
        result = Object.values(CLUBS_BASKETBALL);
        break;
      case CATEGORIES.TENNIS:
        result = Object.values(JOUEUR_TENNIS);
        break;
      case CATEGORIES.HOCHEY_GLACE:
        result = Object.values(CLUBS_HOCHEY_GLACE);
        break;
      default:
        result =  [];
    }
    return result;
  }

  loadEquipeInconnu(code: string): Equipe {
    let label: string = code ? code.toLowerCase().replace('_', ' ') : '';
    while (label.includes('_')){
      label = label.replace('_', ' ');
    }
    return new Equipe({
      code,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      url: this.urlLogoInconnu
    });
  }
}

export  const URL_LOGO_INCONNU: string = 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48';

export const CATEGORIES: any = {
  TENNIS: new Categorie({
    code: 'TENNIS',
    label: 'Tennis',
    img: 'assets/icons/sports/picto-tennis.png',
    urlLogoInconnu: 'https://www.gstatic.com/images/branding/product/2x/avatar_anonymous_48dp.png'
  }),
  BASKETBALL: new Categorie({
    code: 'BASKETBALL',
    label: 'Basketball',
    img: 'assets/icons/sports/picto-basketball.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'

  }),
  FOOTBALL: new Categorie({
    code: 'FOOTBALL',
    label: 'Football',
    img: 'assets/icons/sports/picto-football.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  RUGBY: new Categorie({
    code: 'RUGBY',
    label: 'Rugby',
    img: 'assets/icons/sports/picto-rugby.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  HOCHEY_GLACE: new Categorie({
    code: 'HOCHEY_GLACE',
    label: 'Hochey sur glace',
    img: 'assets/icons/sports/picto-hochey-glace.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  BASEBALL: new Categorie({
    code: 'BASEBALL',
    label: 'Baseball',
    img: 'assets/icons/sports/picto-baseball.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  FOOT_AMERICAIN: new Categorie({
    code: 'FOOT_AMERICAIN',
    label: 'Foot américain',
    img: 'assets/icons/sports/picto-foot-americain.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  VOLLEY_BALL: new Categorie({
    code: 'VOLLEY_BALL',
    label: 'Volley-ball',
    img: 'assets/icons/sports/picto-volley-ball.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  TENNIS_DE_TABLE: new Categorie({
    code: 'TENNIS_DE_TABLE',
    label: 'Tennis de table',
    img: 'assets/icons/sports/picto-tennis-de-table.svg',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  BADMINTON: new Categorie({
    code: 'BADMINTON',
    label: 'Badminton',
    img: 'assets/icons/sports/picto-badminton.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  FLECHETTES: new Categorie({
    code: 'FLECHETTES',
    label: 'Flechettes',
    img: 'assets/icons/sports/picto-flechettes.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  MMA: new Categorie({
    code: 'MMA',
    label: 'MMA',
    img: 'assets/icons/sports/picto-mma.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  CYCLISME: new Categorie({
    code: 'CYCLISME',
    label: 'Cyclisme',
    img: 'assets/icons/sports/picto-cyclisme.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  BOXE: new Categorie({
    code: 'BOXE',
    label: 'Bose',
    img: 'assets/icons/sports/picto-boxe.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  GOLF: new Categorie({
    code: 'GOLF',
    label: 'Golf',
    img: 'assets/icons/sports/picto-golf.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  HANDBALL: new Categorie({
    code: 'HANDBALL',
    label: 'Handball',
    img: 'assets/icons/sports/picto-handball.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  ESPORTS: new Categorie({
    code: 'ESPORTS',
    label: 'ESports',
    img: 'assets/icons/sports/picto-formule1.png',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
};

export const LIST_CATEGORIES: Array<Categorie> = [
  CATEGORIES.TENNIS,
  CATEGORIES.BASKETBALL,
  CATEGORIES.FOOTBALL,
  CATEGORIES.RUGBY,
  CATEGORIES.HOCHEY_GLACE,
  CATEGORIES.BASEBALL,
  CATEGORIES.FOOT_AMERICAIN,
 // CATEGORIES.VOLLEY_BALL,
 // CATEGORIES.TENNIS_DE_TABLE,
  CATEGORIES.BADMINTON,
//  CATEGORIES.FLECHETTES,
  CATEGORIES.ESPORTS,

];
