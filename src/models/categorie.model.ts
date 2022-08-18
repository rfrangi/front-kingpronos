import {CLUBS_BASKETBALL, CLUBS_FOOTBALL, JOUEUR_TENNIS, Equipe} from './equipe.model';

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
    img: 'assets/icons/picto-tennis.svg',
    urlLogoInconnu: 'https://www.gstatic.com/images/branding/product/2x/avatar_anonymous_48dp.png'
  }),
  BASKETBALL: new Categorie({
    code: 'BASKETBALL',
    label: 'Basketball',
    img: 'assets/icons/picto-basketball.svg',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'

  }),
  FOOTBALL: new Categorie({
    code: 'FOOTBALL',
    label: 'Football',
    img: 'assets/icons/picto-football.svg',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
  RUGBY: new Categorie({
    code: 'RUGBY',
    label: 'Rugby',
    img: 'assets/icons/picto-football.svg',
    urlLogoInconnu: 'https://dimg-pa.googleapis.com/lg/CgA.png?sig=AI8nk_cT_fvF9XHLwmKH9FoQ7l3x&key=AIzaSyCUqbG5Kw_8jb3cy2ZBKvV2kAi8z0qmQO0&sk=TTGMbb7EXmY&w=48&h=48'
  }),
};

export const LIST_CATEGORIES: Array<Categorie> = [
  CATEGORIES.TENNIS,
  CATEGORIES.BASKETBALL,
  CATEGORIES.FOOTBALL
];
