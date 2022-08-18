import { Component} from '@angular/core';

@Component({
  selector:  'aides',
  styleUrls: ['./aides.component.scss'],
  template: `
    <div class="block">
      <h3>Gestion de votre bankroll</h3>
      <p>
        Une bonne gestion du capital est primordiale pour gagner de l’argent avec les paris sportifs : jouez en fonction de l’argent disponible sur votre compte de jeu.
        On conseille sur le site et l’application de jouer les matchs en simple (paris du jour) avec 1%, 2%, 5% voire 10% (très rare) de votre capital.
        Pour les combinés, on conseille de jouer entre 0.5% et 1% du capital avec un maximum de 4 matchs (voire 5 si une des côtes proposées est inférieure à 1.20)
      </p>
    </div>

    <div class="block">
      <h3>Choisir le bookmaker le plus adapté à votre façon de jouer</h3>
      <p>
        La multiplication des bookmakers oblige à une analyse poussée des critères de chacun. Certains books sont adeptes des côtes légèrement supérieures sur les favoris (Unibet, Winamax). D’autres font le contraire en augmentant les côtes des outsiders (Betclic). Winamax et Unibet permettent aussi de combiner des matchs “live” et des matchs “à venir” contrairement à Betclic. Ensuite, la plupart des books ont maintenant le Cashout (possibilité de récupérer une partie de sa mise ou de son gain en cours de match) mais Unibet ne l’a toujours pas adopté.
      </p>
    </div>


    <div class="block">
      <h3>Jouer les bons jours</h3>
      <p>
        Il est indispensable d’être capable de ne pas jouer certains jours et de ne pas “jouer pour jouer”. Le site et l’application proposent néanmoins des pronos quasiment tous les jours mais il n’est pas rare de voir la mention “no prono” certains jours si aucun match n’est susceptible de nous intéresser. La confiance indiquée pour chaque pari est à suivre pour déterminer la mise à jouer.
      </p>
    </div>
  `,
})
export class AidesComponent {

  constructor() {}

}
