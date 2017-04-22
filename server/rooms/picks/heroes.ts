import {Hero} from '../../../game/Hero';

export default {
    get : () => {
        return [
            new Hero(1, "Rifleman", "http://lorempixel.com/200/100/people/7"),
            new Hero(2, "Tank Buster", "http://lorempixel.com/200/100/people/9"),
            new Hero(3, "Rocketeer", "http://lorempixel.com/200/100/people/3"),
            new Hero(4, "Rick Picker", "http://lorempixel.com/200/100/people/8"),
            new Hero(5, "Medic", "http://lorempixel.com/200/100/people/2"),
            new Hero(6, "Artillery", "http://lorempixel.com/200/100/people/3"),
            new Hero(7, "Scout", "http://lorempixel.com/200/100/people/1"),
            new Hero(8, "General", "http://lorempixel.com/200/100/people/6"),
            new Hero(9, "Tank", "http://lorempixel.com/200/100/people/5"),
            new Hero(10, "Humvee", "http://lorempixel.com/200/100/people/4"),
        ]
    }
}