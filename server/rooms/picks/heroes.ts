import HeroPortrait from '../../../game/Hero';

export default {
    get : () => {
        return [
            new HeroPortrait(1, "Rifleman", "http://lorempixel.com/200/100/people/7"),
            new HeroPortrait(2, "Tank Buster", "http://lorempixel.com/200/100/people/9"),
            new HeroPortrait(3, "Rocketeer", "http://lorempixel.com/200/100/people/3"),
            new HeroPortrait(4, "Rick Picker", "http://lorempixel.com/200/100/people/8"),
            new HeroPortrait(5, "Medic", "http://lorempixel.com/200/100/people/2"),
            new HeroPortrait(6, "Artillery", "http://lorempixel.com/200/100/people/3"),
            new HeroPortrait(7, "Scout", "http://lorempixel.com/200/100/people/1"),
            new HeroPortrait(8, "General", "http://lorempixel.com/200/100/people/6"),
            new HeroPortrait(9, "Tank", "http://lorempixel.com/200/100/people/5"),
            new HeroPortrait(10, "Humvee", "http://lorempixel.com/200/100/people/4"),
        ]
    }
}