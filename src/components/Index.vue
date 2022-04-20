<template>
  <div class="row">


    <div class="gameover-outer">
          <div class="gameover">
            <h5>Pithecator</h5>
            <div class="row">
              <div class="col-3">
                
              </div>
              <div class="col-6 menu">
                <form @submit='newGame'>
                  <button type="submit" class="btn-menu">Start new game</button>
                </form>
                <router-link v-if='load' class="btn-menu" to='/game'>Continue</router-link>
                <router-link class="btn-menu" to='/donate'>Donate</router-link><br>
                <alert :message="message" :success="success" v-if='showMessage'></alert>
              </div>
              <div class="col-3">
                
              </div>
            </div>
          </div>
    </div>

      <div class="map-painting">

            <div class="location-point none" v-for='(v,k) in menu_locations' :style="{'top':v.positionY+'px','left':v.positionX+'px','border-color':v.color}">

            </div>

      </div>

  </div>
</template>

<script>

import Alert from './Alert'
import { page } from 'vue-analytics'

export default {
  props: ['showModal'],
  name: 'Menu',
  metaInfo: {
        title: 'Pithecator | Essential strategy game',
        meta: [
          { vmid: 'description', property: 'description', content: 'Pithecator is a strategy web browser game you deserved.' },
          { vmid: 'og:title', property: 'og:title', content: 'Pithecator | Essential strategy game' },
          { vmid: 'og:description', property: 'og:description', content: 'Pithecator is a strategy web browser game you deserved.' },
          { vmid: 'keywords', property: 'keywords', content: 'Pithecator, main page, strategy game, essential, browser game, browser strategy, essential game' }
        ],
  },
  data() {
    return {
      load: false,
      game: {
          "info" : true,
          "year" : 942000,
          "day" : 0,
          "intelligence" : 0.0,
          "gameover": false,
          "gameover_hunger": false,
          "gameover_leader_death": false,
          "pops_explore": 14,
          "food" : 0.0,
          "characterPrice" : 50,
          "modificators" : {

          },
          "locations" : {

            "home" : {
              "population" : true,
              "unknown" : false,
              "explore": true,
              "enemies": false,
              "tribe": "default",
              "positionY": 260,
              "positionX": 600,
              "dist": 600,
              "status": "explored",
              "color": "#db9388",
              "food" : 0.0,
              "food_extraction": 0.0,
              "int_extraction": 0.0,
              "army": {

              },
              "modificators" : {
                "food" : {
                  "flora" : {
                    "increase" : 2.5,
                    "decrease" : 0.0,
                    "required_int": 2.5,
                    "description" : "Flora increases plant extraction for 2.5 Required intelligence 2.5"
                  }
                },
                "animals" : {

                },
                "buildings" : {

                }
              }
            }

          },
          "characters" : {

          },
          "map":{

          },
          "tribes" : {
            "default" : {
              "color" : "#db9388"
            },
            "enemy1" : {
              "color" : "#b55972",
              "char" : "i"
            },
            "enemy2" : {
              "color" : "#614684",
              "char" : "u"
            },
            "enemy3" : {
              "color" : "#38427a",
              "char" : "a"
            },
            "enemy4" : {
              "color" : "#66a7b3",
              "char" : "y"
            },
            "enemy5" : {
              "color" : "#66b36d",
              "char" : "e"
            },
            "enemy6" : {
              "color" : "#98ab3b",
              "char" : "q"
            },
            "enemy7" : {
              "color" : "#b36c1e",
              "char" : "Ia"
            },
            "enemy8" : {
              "color" : "#b3342c",
              "char" : "Oa"
            },
          },
          "modificatorsStore":{
            "Comfortable cave":{
              "mod": {
                "increase" : 0.0,
                "decrease" : 0.0,
                "class": "increase-sup",
                "description" : "Comfortable cave New pop price -50%"
              },
              "class": "increase-sup",
              "parameter": "price",
              "desc": "New pop price -50%",
              "symbol": "c",
              "price": 200
            },
            "Digging stick":{
              "mod": {
                "increase" : 1.5,
                "decrease" : 0.0,
                "class": "increase-int",
                "description" : "Digging stick Intelligence of the population +1.5"
              },
              "class": "increase-int",
              "parameter": "intelligence",
              "desc": "Intelligence of the population +1.5",
              "symbol": "d",
              "price": 500
            },
            "Sharpened spears":{
              "mod": {
                "increase" : 1.5,
                "decrease" : 0.0,
                "class": "increase-str",
                "description" : "Sharpened spears Strength of the population +1.5"
              },
              "class": "increase-str",
              "parameter": "strength",
              "desc": "Strength of the population +1.5",
              "symbol": "s",
              "price": 1000
            }
          }
      },
      ajaxConfig: {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer: ' + this.$store.state.user.token
          }
      },
      menu_locations: [],
      showMessage: false,
      rangeY: [],
      rangeX: []
    }
  },
  methods : {
    track () {
      page('/');
    },
    newGame(e){
      e.preventDefault();

      try{

        this.game.food = this.randomFloat(99.42, 109.32);
        this.game.locations.home.food = this.game.food;
        let characters_count = this.randomInt(18, 22);
        let locations_count = this.randomInt(30, 35);
        let special_random = [];
        let enemy_count = this.randomInt(110, 130);
        let enemy_divide = this.randomInt((enemy_count - 90), (enemy_count - 30));
        let enemy_tribe = 'enemy' + this.randomInt(1, 8);
        let enemy_locs = [this.randomInt(1, 3), (locations_count - this.randomInt(1, 3))];

        while(special_random.length < this.randomInt(6, 8)){
          let r = Math.floor(Math.random() * locations_count) + 1;
          if(special_random.indexOf(r) === -1) special_random.push(r);
        }

        for(let i = characters_count - 1; i >= 0; i--) this.createCharacter('home');

        this.createLeader('home');

        for(let i = locations_count - 1; i >= 0; i--){
          let special = special_random.includes(i) ? true : false;
          this.createLocation(special, 'none', '#1f1e1b');
        }

        for(let i in this.game.locations){
          this.game.map[this.game.locations[i].dist] = {
            "name": i,
            "positionY": this.game.locations[i].positionY,
            "positionX": this.game.locations[i].positionX
          }
        }

        let locKeys = Object.keys(this.game.map);

        for(let i in enemy_locs){
          this.game.locations[this.game.map[locKeys[enemy_locs[i]]].name].tribe = enemy_tribe;
          this.game.locations[this.game.map[locKeys[enemy_locs[i]]].name].color = this.game.tribes[enemy_tribe].color;
          this.game.locations[this.game.map[locKeys[enemy_locs[i]]].name].enemies = true;
        }

        for(let i = enemy_count - 1; i >= 0; i--){
          let loc = (i < enemy_divide) ? this.game.map[locKeys[enemy_locs[0]]].name : this.game.map[locKeys[enemy_locs[1]]].name;
          this.createEnemy(loc, enemy_tribe);
        }

        localStorage.setItem('game', JSON.stringify(this.game));
        this.$router.push('/game');

      }catch(err){
        this.message = 'Failed to create locations. Try again.';
        this.success = false;
        this.openMessage();
      }

    },
    checkGame(){
      if(localStorage.getItem('game'))this.load = true;
    },
    randomInt(min, max) {
      let rand = min - 0.5 + Math.random() * (max - min + 1);
      return Math.round(rand);
    },
    randomFloat(min, max) {
      let rand = Math.random() * (max - min) + min;
      return parseFloat(rand.toFixed(1));
    },
    getLetter() {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      return alphabet[Math.floor(Math.random() * alphabet.length)];
    },
    getLocationY() {
      let y = this.randomInt(50, 500);
      for(let i in this.game.locations){
        let diff = (this.game.locations[i]['positionY'] > y) ? (this.game.locations[i]['positionY'] - y) : (y - this.game.locations[i]['positionY']);
          if(diff < 10)
            return this.getLocationY();
      }
      return y;
    },
    getLocationX() {
      let x = this.randomInt(100, 1200);
      for(let i in this.game.locations){
        let diff = (this.game.locations[i]['positionY'] > x) ? (this.game.locations[i]['positionY'] - x) : (x - this.game.locations[i]['positionY']);
          if(diff < 10)
            return this.getLocationX();
      }
      return x;
    },
    createCharacter(location){
      let name = this.getLetter() + 'o' + this.getLetter() + 'o';
      if(this.game.characters[name] !== undefined){
        this.createCharacter(location);
        return false;
      }
      let years = this.randomInt(16, 39);
      let dyear = years + this.randomInt(0, 10);
      let birthday = this.randomInt(0, 360);
      let dday = this.randomInt(birthday, 360); 
      this.game.characters[name] = {
          "leader" : false,
          "status" : "rest",
          "name" : name,
          "location": location,
          "tribe": "default",
          "years" : years,
          "strength" : this.randomFloat(2.0, 4.5),
          "intelligence" : this.randomFloat(2.0, 4.5),
          "supply" : this.randomFloat(2.0, 3.5),
          "birthday": birthday,
          "strength_upd" : 0.0,
          "intelligence_upd" : 0.0,
          "supply_upd" : 0.0,
          "death" : {
            "year" : dyear,
            "day" : dday
          },
          "modificators" : {
            "strength" : {

            },
            "intelligence" : {

            },
            "supply" : {

            }
          }
        }
    },
    createEnemy(location, tribe){
      let char = this.game.tribes[tribe].char;
      let name = this.getLetter() + char + this.getLetter() + char + this.getLetter();
      if(this.game.characters[name] !== undefined){
        this.createEnemy(location, tribe, char);
        return false;
      }
      let mod_random = this.randomInt(0, 100);
      this.game.characters[name] = {
          "leader" : false,
          "status" : "rest",
          "name" : name,
          "location": location,
          "tribe": tribe,
          "years" : this.randomInt(16, 25),
          "strength" : this.randomFloat(3.0, 4.5),
          "intelligence" : this.randomFloat(3.0, 4.5),
          "supply" : this.randomFloat(2.0, 3.5),
          "birthday": this.randomInt(0, 360),
          "strength_upd" : 0.0,
          "intelligence_upd" : 0.0,
          "supply_upd" : 0.0,
          "death" : {
            "year" : this.randomInt(40, 45),
            "day" : this.randomInt(0, 360)
          },
          "modificators" : {
            "strength" : {

            },
            "intelligence" : {

            },
            "supply" : {

            }
          }
        }
      if(mod_random > 35 && mod_random < 65){
        this.game.characters[name].modificators.strength['Tough guy'] = {
          "increase" : 1.5,
          "decrease" : 0.0,
          "description" : "Tough guy has more strength for 1.5"
        }
      }if(mod_random <= 5 || mod_random >= 95){
        this.game.characters[name].modificators.strength['Fragile boy'] = {
          "increase" : 0.0,
          "decrease" : 1.5,
          "description" : "Fragile boy has less strength for 1.5"
        }
      }
    },
    createLeader(location){
      let name = this.getLetter() + 'o' + this.getLetter() + 'o';
      if(this.game.characters[name] !== undefined){
        this.createCharacter(location);
        return false;
      }
      this.game.characters[name] = {
          "leader" : true,
          "status" : "rest",
          "name" : name,
          "location": location,
          "tribe": "default",
          "enemies": false,
          "years" : this.randomInt(16, 20),
          "strength" : this.randomFloat(3.0, 4.5),
          "intelligence" : this.randomFloat(3.0, 4.5),
          "supply" : this.randomFloat(2.0, 2.5),
          "birthday": this.randomInt(0, 360),
          "strength_upd" : 0.0,
          "intelligence_upd" : 0.0,
          "supply_upd" : 0.0,
          "death" : {
            "year" : this.randomInt(40, 45),
            "day" : this.randomInt(0, 360)
          },
          "modificators" : {
            "strength" : {
              "leader" : {
                "increase" : 2.5,
                "decrease" : 0.0,
                "description" : "Status as a leader increases strength for 2.5"
              }
            },
            "intelligence" : {
              "leader" : {
                "increase" : 0.7,
                "decrease" : 0.0,
                "description" : "Status as a leader increases intelligence for 0.7"
              }
            },
            "supply" : {

            }
          }
        }
    },
    createLocation(special, tribe, color){
      let name = this.getLetter() + 'a' + this.getLetter() + this.getLetter() + 'a';
      if(this.game.locations[name] !== undefined){
        this.createLocation();
        return false;
      }

      let key_y = Math.floor(Math.random() * this.rangeY.length);
      let key_x = Math.floor(Math.random() * this.rangeX.length);
      let y = this.rangeY[key_y];
      let x = this.rangeX[key_x];
      let dist = x;
      this.rangeY.splice(key_y, 1);
      this.rangeX.splice(key_x, 1);

      this.game.locations[name] = {
            "population" : false,
            "unknown" : true,
            "explore": false,
            "tribe": tribe,
            "color" : color,
            "positionY": y,
            "positionX": x,
            "dist": dist,
            "status":"",
            "food" : 0.0,
            "food_extraction": 0.0,
            "int_extraction": 0.0,
            "army": {

            },
            "modificators" : {
              "food" : {

              },
              "animals":{

              },
              "buildings" : {

              }
            }
          }

      let mod_random = this.randomInt(0, 100);
      let special_random = this.randomInt(0, 100);

      if(mod_random > 5 && mod_random < 55){
        this.game.locations[name].modificators.food['flora'] = {
            "increase" : 2.5,
            "decrease" : 0.0,
            "required_int": 2.5,
            "description" : "Flora increases plant extraction for 2.5 Required intelligence 2.5"
          }
          if(special){
            if(special_random >= 0 && special_random < 10){
              this.game.locations[name].modificators.food['coconuts'] = {
                "increase" : 3.1,
                "decrease" : 0.0,
                "required_int": 2.8,
                "int_increase": 1.5,
                "description" : "Coconuts increases food for 3.1 intelligence points for 1.5 But it takes 2.8 intelligence to understend how to extract it"
              }
            }
            if(special_random >= 10 && special_random < 30){
              this.game.locations[name].modificators.food['tropics'] = {
                "increase" : 1.5,
                "decrease" : 0.0,
                "required_int": 2.6,
                "int_increase": 1.0,
                "description" : "Tropics increases flora variety for 1.5 intelligence points for 1.0 Required intelligence 2.6"
              }
            }
            if(special_random >= 30 && special_random < 70){
              this.game.locations[name].modificators.food['swamp'] = {
                "increase" : 1.0,
                "decrease" : 0.0,
                "required_int": 1.5,
                "int_increase": 0.5,
                "description" : "Swamp increases flora variety for 1.0 intelligence points for 0.5 Required intelligence 1.5"
              }
            }
            if(special_random >= 70 && special_random < 90){
              this.game.locations[name].modificators.food['rainforest'] = {
                "increase" : 1.5,
                "decrease" : 0.0,
                "required_int": 2.0,
                "int_increase": 1.0,
                "description" : "Rainforest increases flora variety for 1.5 intelligence points for 1.0 Required intelligence 2.0"
              }
            }
            if(special_random >= 90 && special_random <= 100){
              this.game.locations[name].modificators.food['bananas'] = {
                "increase" : 3.0,
                "decrease" : 0.0,
                "required_int": 3.0,
                "int_increase": 1.5,
                "description" : "Bananas increases food for 3.0 intelligence points for 1.5 It takes 3.0 intelligence to understend how to eat it"
              }
            }
          }
        }else if(mod_random < 95 && mod_random > 45){
          this.game.locations[name].modificators.animals['fauna'] = {
              "increase" : 3.0,
              "decrease" : 0.0,
              "required_str": 3.0,
              "description" : "Fauna increases animals extraction for 3.0 Required strength 3.0"
            }
          if(special){
            if(special_random >= 0 && special_random < 10){
              this.game.locations[name].modificators.animals['bears'] = {
                "increase" : 4.0,
                "decrease" : 0.0,
                "required_str": 4.1,
                "int_increase": 1.5,
                "description" : "Bears increases food for 4.0 intelligence points for 1.5 Required strength 4.1 Otherwise he will eat you by himthis"
              }
            }
            if(special_random >= 10 && special_random < 30){
              this.game.locations[name].modificators.animals['deers'] = {
                "increase" : 1.5,
                "decrease" : 0.0,
                "required_str": 3.5,
                "int_increase": 1.0,
                "description" : "Deers increases food for 1.5 intelligence points for 1.0 Required strength 3.5"
              }
            }
            if(special_random >= 30 && special_random < 70){
              this.game.locations[name].modificators.animals['eggs'] = {
                "increase" : 1.0,
                "decrease" : 0.0,
                "required_str": 2.0,
                "int_increase": 0.5,
                "description" : "Bird eggs increases food for 1.0 intelligence points for 0.5 Required strength 2.0"
              }
            }
            if(special_random >= 70 && special_random < 90){
              this.game.locations[name].modificators.animals['deers'] = {
                "increase" : 1.5,
                "decrease" : 0.0,
                "required_str": 3.5,
                "int_increase": 1.0,
                "description" : "Deers increases food for 1.5 intelligence points for 1.0 Required strength 3.5"
              }
            }
            if(special_random >= 90 && special_random <= 100){
              this.game.locations[name].modificators.animals['mammoths'] = {
                "increase" : 4.5,
                "decrease" : 0.0,
                "required_str": 4.5,
                "int_increase": 1.5,
                "description" : "Mammoth  increases food for 4.5 intelligence points for 1.5 Required strength 4.5 Hard to get Easy to lose"
              }
            }
          }
        }else
          special = false;
    },
    startMenu(){
      let locations_count = this.randomInt(30, 35);
      for(let i = locations_count - 1; i >= 0; i--){
        this.createMenuLocation();
      }
    },
    createMenuLocation(){
      let name = 'none';

      let key_y = Math.floor(Math.random() * this.rangeY.length);
      let key_x = Math.floor(Math.random() * this.rangeX.length);
      let y = this.rangeY[key_y];
      let x = this.rangeX[key_x];
      let dist = x;

      this.menu_locations.push({
            "tribe": 'none',
            "color" : '#1f1e1b',
            "positionY": y,
            "positionX": x,
            "dist": dist
          });
    },
    openMessage(){
      this.showMessage = true;
            setTimeout(() => {
              this.showMessage = false;
            }, 3000);
    }
  },
  components: {
    alert: Alert
  },
  created(){
    this.checkGame();
    for(let i = 50; i <= 500; i += 10){
      if(i !== 260)this.rangeY.push(i);
    }
    for(let i = 100; i <= 1200; i += 10){
      if(i !== 600)this.rangeX.push(i);
    }
    this.startMenu();
    this.track();
  }
};
</script>
