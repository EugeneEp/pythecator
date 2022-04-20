<template>
  <div>

    <template v-if='!loading'>
      <div>
        <alert :message="message" :success="success" v-if='showMessage'></alert>

        <nav class="navbar navbar-expand-sm game-navbar">
            <ul class="navbar-nav navbar-menu">
              <li class="nav-item menu-left">
                <span class="nav-link" @click="menuLeftOpen();">{{current_location}}</span>
              </li>
              <li class="nav-item food">
                <span class="nav-link" :data-title='"Increase per day: " + food_statistic_in + " Decrease per day: " + food_statistic_de'>Food: {{game.food}} / {{food_statistic}}</span>
              </li>
              <li class="nav-item int">
                <span class="nav-link" data-title='Intelligence points'>Int: {{game.intelligence}}</span>
              </li>
              <li class="nav-item str">
                <span class="nav-link" data-title="Total population strength">Str: {{str_statistic}}</span>
              </li>
              <li class="nav-item pop">
                <span class="nav-link" data-title="Population size">Pop: {{characters_count}}</span>
              </li>
            </ul>
            <ul @click='saveExit' class="navbar-nav navbar-save ml-auto">
              Save And Exit
            </ul>
            <ul class="navbar-nav navbar-date ml-auto">
              <li class="nav-item">
                {{game.year}} B.C. Day: {{game.day}} 
              </li>
              <li class="nav-item">
                <i @click='pause = !pause' :class='{"fa-pause":!pause, "fa-play":pause}' class="fa"></i>
              </li>
              
            </ul>
        </nav>

        <i class="fa fa-info info-icon" @click='game.info = !game.info'></i>

        <div class="main_menu" v-if='menuLeft'>
          <i class="fa fa-times" @click='menuLeft = !menuLeft'></i>
          <div class="leader-block row">
            <div class="col-6 leader-img">
              <img src="static/images/leader.png" :style='{"border-right":"8px solid" + game.tribes[leader.tribe].color}'>
            </div>
            <div class="col-6 leader-stat">
              <h5>{{leader.name}} The Leader</h5>
              <table>
                <tr>
                  <td>Age: {{leader.years}}</td><td></td>
                </tr>
                <tr>
                  <td>Strength: {{leader.strength_upd}}</td><td></td>
                </tr>
                <tr>
                  <td>Intelligence: {{leader.intelligence_upd}}</td><td></td>
                </tr>
                <tr>
                  <td>Supply: {{leader.supply_upd}}</td><td></td>
                </tr>
                <tr>
                  <td>Birthday after: {{leader.birthday}} days</td><td></td>
                </tr>
              </table>
            </div>
            <div class="col-12 leader-info">
              <span>Modificators:</span>
              <div class="row modificators">
                <div class="col-4 strength-mod">
                  Strength: 
                </div>
                <div class="col-8 modificator-item">
                  <p v-for='(v, k) in leader.modificators.strength' :class="{'increase':v.increase>0 && v.decrease==0, 'decrease':v.increase==0 && v.decrease>0}" :data-title='v.description'>
                    {{k[0]}}
                  </p>
                </div>
                <div class="col-4 intelligence-mod">
                  Intelligence:
                </div>
                <div class="col-8 modificator-item">
                  <p v-for='(v, k) in leader.modificators.intelligence' :class="{'increase':v.increase>0 && v.decrease==0, 'decrease':v.increase==0 && v.decrease>0,'increase-explore':v.increase==0 && v.decrease==0}" :data-title='v.description'>
                    {{k[0]}}
                  </p>
                </div>
                <div class="col-4 food-mod">
                  Food: 
                </div>
                <div class="col-8 modificator-item">
                  <p v-for='(v, k) in leader.modificators.supply' :class="{'increase':v.increase>0 && v.decrease==0, 'decrease':v.increase==0 && v.decrease>0}" :data-title='v.description'>
                    {{k[0]}}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="location-block">
            <div class="row location-tabs">
              <div class="col-6" :class='{"active":location}' @click='location=true'>
                Location
              </div>
              <div class="col-6" :class='{"active":!location}' @click='location=false'>
                Pops
              </div>
            </div>
            <div class="row location-info" v-if='location'>
                <div class="col-6 leader-img">
                  <img src="static/images/home.png">
                </div>
                <div class="col-6 leader-stat">
                  <div>Name: home</div>
                  <div>Modificators:</div>
                  <div class="modificator-item">
                    <p v-for='(v, k) in game.locations.home.modificators.food' :class="{'increase':v.increase>0 && v.decrease==0, 'decrease':v.increase==0 && v.decrease>0}" :data-title='v.description'>
                      {{k[0]}}
                    </p>
                    <p v-for='(v, k) in game.locations.home.modificators.animals' :class="{'increase':v.increase>0 && v.decrease==0, 'decrease':v.increase==0 && v.decrease>0}" :data-title='v.description'>
                      {{k[0]}}
                    </p>
                    <p v-for='(v, k) in game.locations.home.modificators.buildings' :class="v.class" :data-title='v.description'>
                      {{k[0]}}
                    </p>
                  </div>
                  <div>
                    <button class="buy-modificators" @click='closeAllWindows();modStore = !modStore'>Modificators store</button>
                  </div>
                </div>
            </div>
            <div class="pops-info" v-if='!location'>
              <div class="row all-pops-action">
                <div class="col-4" @click='selectAll("home")' data-title='Select all pops in current location'>
                  Select all
                </div>
                <div class="col-4" @click='closePopTabs(); showLocationAll = !showLocationAll' data-title='Change location of selected pops'>
                  Pops location <i class="fa fa-caret-down"></i>
                </div>
                <div class="col-4">

                </div>
              </div>
              <div class="row pop-info-desc">
                <div class="col-1">

                </div>
                <div class="col-2" data-title='You can open character profile'>
                  Name
                </div>
                <div class="col-1" data-title='Strength'>
                  Str
                </div>
                <div class="col-1" data-title='Intelligence'>
                  Int
                </div>
                <div class="col-1" data-title='Supply'>
                  Sup
                </div>
                <div class="col-3">
                  Status
                </div>
                <div class="col-3">
                  Location
                </div>
              </div>
              <div class="pops-info-scroll">
                <div class="row pop-info">
                  <div class="col-1">

                  </div>
                  <div class="col-2 check-character">
                    ????
                  </div>
                  <div class="col-1 pop-str">
                    ?
                  </div>
                  <div class="col-1 pop-int">
                    ?
                  </div>
                  <div class="col-1 pop-sup">
                    ?
                  </div>
                  <div  v-if='game.food > game.characterPrice' class="col-3 create-new-pop" :data-title="'Price: '+ game.characterPrice + ' food'" @click='createCharacter("home")'>
                    Create new pop
                  </div>
                  <div  v-else class="col-3 create-new-pop" :data-title="'Not enough food. Required ' + game.characterPrice">
                    Create new pop
                  </div>
                  <div class="col-3 chose-status">
                    home
                  </div>
                </div>
                <template v-for='(v, k) in game.characters'>
                  <div class="row pop-info" v-if='v.tribe == "default"'>
                    <div class="col-1 checkbox-pop">
                      <input v-if='v.location=="home"' type="checkbox" :checked='selected.includes(k)' @change='selectCharacter(k)'>
                    </div>
                    <div :style='{"background-color":game.tribes[v.tribe].color}' class="col-2 check-character" @click='openCharacter(k)'>
                      {{k}} <i class="fa fa-caret-right"></i>
                    </div>
                    <div class="col-1 pop-str">
                      {{v.strength_upd}}
                    </div>
                    <div class="col-1 pop-int">
                      {{v.intelligence_upd}}
                    </div>
                    <div class="col-1 pop-sup">
                      {{v.supply_upd}}
                    </div>
                    <template v-if='v.status=="explore"'>
                      <div class="col-3 chose-status">
                        explore
                      </div>
                      <div class="col-3 chose-location">
                        {{v.location}}
                      </div>
                    </template>
                    <template v-else>
                      <div class="col-3 chose-status" @click='showStatusWindow(k)'>
                        {{v.status}} <i class="fa fa-caret-down"></i>
                      </div>
                      <div class="col-3 chose-location" @click='showLocationWindow(k)'>
                        {{v.location}} <i class="fa fa-caret-down"></i>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
              <div class="change-status" v-if='showStatus'>
                <h5>{{statusCharacter}}</h5>
                <div @click='changeStatus("rest")'>rest</div>
                <template v-if='!game.locations[game.characters[statusCharacter].location].unknown'>
                  <div v-if='game.characters[statusCharacter].intelligence_upd < 2.5' data-title='Not smart enough. Required intelligence 2.5'>extract flora</div>
                  <div v-else @click='changeStatus("flora")'>extract flora</div>
                  <div v-if='game.characters[statusCharacter].strength_upd < 3.0' data-title='Not strong enough. Required strength 3.0'>extract fauna</div>
                  <div v-else @click='changeStatus("fauna")'>extract fauna</div>
                </template>
                <template v-else>
                  <div v-if='characters_count < game.pops_explore' :data-title='"Not enough population. Required "+game.pops_explore'>explore location</div>
                  <div v-else-if='game.locations[game.characters[statusCharacter].location].status=="exploring"' :data-title='"Already under explore"'>explore location</div>
                  <div v-else-if='game.characters[statusCharacter].intelligence_upd >= 3' @click='changeStatus("explore")'>explore location</div>
                  <div data-title='Not smart enough. Required intelligence 3.0' v-else>explore location</div>
                </template>
              </div>
              <div class="change-location" v-if='showLocation'>
                <h5>{{locationCharacter}}</h5>
                <div class="change-outer">
                  <template v-for='(v, k) in game.locations'>
                    <div v-if='v.explore' @click='changeLocation(k)'>{{k}}</div>
                  </template>
                </div>
              </div>
              <div class="change-location" v-if='showLocationAll'>
                <h5>Selected pops location</h5>
                <div class="change-outer">
                  <template v-for='(v, k) in game.locations'>
                    <div v-if='v.explore' @click='changeLocationAll(k)'>{{k}}</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="main_menu" v-if='menuCharacter'>
          <i class="fa fa-times" @click='menuCharacter = !menuCharacter'></i>
          <div class="leader-block row">
            <div class="col-6 leader-img">
              <img v-if='character.leader' src="static/images/leader.png" :style='{"border-right":"8px solid" + game.tribes[leader.tribe].color}'>
              <img v-else src="static/images/pyth.png" :style='{"border-right":"8px solid" + game.tribes[character.tribe].color}'>
            </div>
            <div class="col-6 leader-stat">
              <h5 v-if='character.leader'>{{character.name}} The Leader</h5>
              <h5 v-else>{{character.name}}<br>The Pithecantrophus</h5>
              <table>
                <tr>
                  <td>Age: {{character.years}}</td><td></td>
                </tr>
                <tr>
                  <td>Strength: {{character.strength_upd}}</td><td></td>
                </tr>
                <tr>
                  <td>Intelligence: {{character.intelligence_upd}}</td><td></td>
                </tr>
                <tr>
                  <td>Supply: {{character.supply_upd}}</td><td></td>
                </tr>
                <tr>
                  <td>Birthday after: {{character.birthday}} days</td><td></td>
                </tr>
              </table>
            </div>
            <div class="col-12 leader-info">
              <span>Modificators:</span>
              <div class="row modificators">
                <div class="col-4 strength-mod">
                  Strength: 
                </div>
                <div class="col-8 modificator-item">
                  <p v-for='(v, k) in character.modificators.strength' :class="{'increase':v.increase>0 && v.decrease==0, 'decrease':v.increase==0 && v.decrease>0}" :data-title='v.description'>
                    {{k[0]}}
                  </p>
                </div>
                <div class="col-4 intelligence-mod">
                  Intelligence:
                </div>
                <div class="col-8 modificator-item">
                  <p v-for='(v, k) in character.modificators.intelligence' :class="{'increase':v.increase>0 && v.decrease==0, 'decrease':v.increase==0 && v.decrease>0,'increase-explore':v.increase==0 && v.decrease==0}" :data-title='v.description'>
                    {{k[0]}}
                  </p>
                </div>
                <div class="col-4 food-mod">
                  Food: 
                </div>
                <div class="col-8 modificator-item">
                  <p v-for='(v, k) in character.modificators.supply' :class="{'increase':v.increase>0 && v.decrease==0, 'decrease':v.increase==0 && v.decrease>0}" :data-title='v.description'>
                    {{k[0]}}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="main_menu check_location" v-if='checkLocationWindow'>
          <i class="fa fa-times" @click='checkLocationWindow = !checkLocationWindow'></i>
          <h5 class="check_location_name">{{checkLocationName}}</h5>
          <div class="location-block">
            <div class="row location-tabs">
              <div class="col-6" :class='{"active":location_check}' @click='location_check=true'>
                Location
              </div>
              <div class="col-6" :class='{"active":!location_check}' @click='location_check=false'>
                Pops
              </div>
            </div>
            <div class="row location-info" v-if='location_check'>
              <template v-if='!game.locations[checkLocationName].unknown'>
                <div class="col-6 leader-img">
                  <img src="static/images/home.png">
                </div>
                <div class="col-6 leader-stat">
                  <div>Name: {{checkLocationName}} <template v-if='game.locations[checkLocationName].enemies'>/ hostile location</template></div>
                  <template v-if='game.locations[checkLocationName].enemies'>
                    <button v-if='!game.locations[checkLocationName].army.default' data-title='You dont have an army in this location' class="start-capture">Start capture</button>
                    <button v-else @click='startCapture(checkLocationName)' class="start-capture">Start capture</button>
                  </template>
                  <div>Modificators:</div>
                  <div class="modificator-item">
                    <p v-for='(v, k) in game.locations[checkLocationName].modificators.food' :class="{'increase':v.increase>0 && v.decrease==0, 'decrease':v.increase==0 && v.decrease>0}" :data-title='v.description'>
                      {{k[0]}}
                    </p>
                    <p v-for='(v, k) in game.locations[checkLocationName].modificators.animals' :class="{'increase-fauna':v.increase>0 && v.decrease==0, 'decrease':v.increase==0 && v.decrease>0}" :data-title='v.description'>
                      {{k[0]}}
                    </p>
                     <p v-for='(v, k) in game.locations[checkLocationName].modificators.buildings' :class="v.class" :data-title='v.description'>
                      {{k[0]}}
                    </p>
                    <template v-for='(v, k) in game.locations[checkLocationName].army'>
                      <p v-if='k=="default" && v.strength' :style='{"background-color":game.tribes[k].color}' :data-title='"Our army str: "+v.strength+" size: "+v.size'>
                          A
                      </p>
                      <p v-else :style='{"background-color":game.tribes[k].color}' :data-title='"Enemy army str: "+v.strength+" size: "+v.size'>
                          A
                      </p>
                    </template>
                  </div>
                  <div v-if='checkLocationName=="home"'>
                    <button class="buy-modificators" @click='closeAllWindows();modStore = !modStore'>Modificators store</button>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="col-12">
                  <h5>Unexplored location <template v-if='game.locations[checkLocationName].enemies'>/ hostile location</template></h5>
                  <template v-if='game.locations[checkLocationName].enemies'>
                    <button v-if='game.locations[checkLocationName].unknown' data-title='Unexplored location' class="start-capture">Start capture</button>
                    <button v-else-if='!game.locations[checkLocationName].army.default' data-title='You dont have an army in this location' class="start-capture">Start capture</button>
                    <button v-else @click='startCapture(checkLocationName)' class="start-capture">Start capture</button>
                  </template>
                  <div>Modificators:</div>
                  <div class="modificator-item">
                    <span class="increase-explore" data-title='Unexplored. You need to send someone to explore this location. Required intelligence 3.0'>
                        U
                    </span>
                    <template v-for='(v, k) in game.locations[checkLocationName].army'>
                      <span v-if='k=="default" && v.strength' :style='{"background-color":game.tribes[k].color}' :data-title='"Our army str: "+v.strength+" size: "+v.size'>
                          A
                      </span>
                      <span v-else-if='!game.locations[checkLocationName].unknown' :style='{"background-color":game.tribes[k].color}' :data-title='"Enemy army str: "+v.strength+" size: "+v.size'>
                          A
                      </span>
                    </template>
                  </div>
                </div>
              </template>
            </div>
            <div class="pops-info" v-if='!location_check'>
              <div class="row all-pops-action">
                <div class="col-4" data-title='Select all pops in current location' @click='selectAll(checkLocationName)'>
                  Select all
                </div>
                <div class="col-4" data-title='Change location of selected pops' @click='closePopTabs(); showLocationAll = !showLocationAll'>
                  Pops location <i class="fa fa-caret-down"></i>
                </div>
                <div class="col-4" data-title='Change status of selected pops' v-if='!game.locations[checkLocationName].unknown' @click='closePopTabs(); showStatusAll = !showStatusAll'>
                  Pops status <i class="fa fa-caret-down"></i>
                </div>
                <div class="col-4" v-else>
                  
                </div>
              </div>
              <div class="row pop-info-desc">
                <div class="col-1">

                </div>
                <div class="col-2" data-title='You can open character profile'>
                  Name
                </div>
                <div class="col-1" data-title='Strength'>
                  Str
                </div>
                <div class="col-1" data-title='Intelligence'>
                  Int
                </div>
                <div class="col-1" data-title='Supply'>
                  Sup
                </div>
                <div class="col-3">
                  Status
                </div>
                <div class="col-3">
                  Location
                </div>
              </div>
              <div class="pops-info-scroll">
                <div class="row pop-info" v-if='!game.locations[checkLocationName].unknown'>
                  <div class="col-1">

                  </div>
                  <div class="col-2 check-character">
                    ????
                  </div>
                  <div class="col-1 pop-str">
                    ?
                  </div>
                  <div class="col-1 pop-int">
                    ?
                  </div>
                  <div class="col-1 pop-sup">
                    ?
                  </div>
                  <div v-if='characters_count >= 1000' class="col-3 create-new-pop" data-title="To many characters">
                    Create new pop
                  </div>
                  <div  v-if='game.food > game.characterPrice' class="col-3 create-new-pop" :data-title="'Price: '+ game.characterPrice + ' food'" @click='createCharacter(checkLocationName)'>
                    Create new pop
                  </div>
                  <div  v-else class="col-4 create-new-pop" :data-title="'Not enough food. Required ' + game.characterPrice">
                    Create new pop
                  </div>
                  <div class="col-3 chose-status">
                    {{checkLocationName}}
                  </div>
                </div>
                <template v-for='(v, k) in game.characters'>
                  <template v-if='v.location == checkLocationName'>
                    <div class="row pop-info" v-if='v.tribe == "default" || !game.locations[checkLocationName].unknown'>
                      <div class="col-1 checkbox-pop">
                        <input v-if='v.tribe == "default"' type="checkbox" :checked='selected.includes(k)' @change='selectCharacter(k)'>
                      </div>
                      <div :style='{"background-color":game.tribes[v.tribe].color}' class="col-2 pop-bordered check-character" @click='openCharacter(k)'>
                        {{k}} <i v-if='v.tribe=="default"' class="fa fa-caret-right"></i>
                      </div>
                      <div class="col-1 pop-str">
                        {{v.strength_upd}}
                      </div>
                      <div class="col-1 pop-int">
                        {{v.intelligence_upd}}
                      </div>
                      <div class="col-1 pop-sup">
                        {{v.supply_upd}}
                      </div>
                      <template v-if='v.tribe!=="default"'>
                        <div class="col-3 chose-status">
                          {{v.status}}
                        </div>
                        <div class="col-3 chose-location">
                          {{v.location}}
                        </div>
                      </template>
                      <template v-else-if='game.locations[checkLocationName].enemies && !game.locations[checkLocationName].unknown'>
                        <div class="col-3 capture-ready">
                          Capture
                        </div>
                        <div class="col-3 chose-location">
                          {{v.location}}
                        </div>
                      </template>
                      <template v-else-if='v.status=="explore"'>
                        <div class="col-3 chose-status">
                          explore
                        </div>
                        <div class="col-3 chose-location">
                          {{v.location}}
                        </div>
                      </template>
                      <template v-else>
                        <div class="col-3 chose-status" @click='showStatusWindow(k)'>
                          {{v.status}} <i class="fa fa-caret-down"></i>
                        </div>
                        <div class="col-3 chose-location" @click='showLocationWindow(k)'>
                          {{v.location}} <i class="fa fa-caret-down"></i>
                        </div>
                      </template>
                    </div>
                  </template>
                </template>
              </div>
              <div class="change-status" v-if='showStatusAll'>
                <h5>Selected pops status</h5>
                <div @click='changeStatusAll("rest")'>rest</div>
                <div @click='changeStatusAll("flora")'>extract flora</div>
                <div @click='changeStatusAll("fauna")'>extract fauna</div>
              </div>
              <div class="change-status" v-if='showStatus'>
                <h5>{{statusCharacter}}</h5>
                <div @click='changeStatus("rest")'>rest</div>
                <template v-if='!game.locations[game.characters[statusCharacter].location].unknown'>
                  <div v-if='game.characters[statusCharacter].intelligence_upd < 2.5' data-title='Not smart enough. Required intelligence 2.5'>extract flora</div>
                  <div v-else @click='changeStatus("flora")'>extract flora</div>
                  <div v-if='game.characters[statusCharacter].strength_upd < 3.0' data-title='Not strong enough. Required strength 3.0'>extract fauna</div>
                  <div v-else @click='changeStatus("fauna")'>extract fauna</div>
                </template>
                <template v-else>
                  <div v-if='characters_count < game.pops_explore' :data-title='"Not enough population. Required "+game.pops_explore'>explore location</div>
                  <div v-else-if='game.locations[game.characters[statusCharacter].location].status=="exploring"' :data-title='"Already under explore"'>explore location</div>
                  <div v-else-if='game.characters[statusCharacter].intelligence_upd >= 3' @click='changeStatus("explore")'>explore location</div>
                  <div data-title='Not smart enough. Required intelligence 3.0' v-else>explore location</div>
                </template>
              </div>
              <div class="change-location" v-if='showLocationAll'>
                <h5>Selected pops location</h5>
                <div class="change-outer">
                  <template v-for='(v, k) in game.locations'>
                    <div v-if='v.explore' @click='changeLocationAll(k)'>{{k}}</div>
                  </template>
                </div>
              </div>
              <div class="change-location" v-if='showLocation'>
                <h5>{{locationCharacter}}</h5>
                <div class="change-outer">
                  <template v-for='(v, k) in game.locations'>
                    <div v-if='v.explore' @click='changeLocation(k)'>{{k}}</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="map-painting">

          <div class="location-point" v-for='(v,k) in game.locations' :style="{'top':v.positionY+'px',left:v.positionX+'px','border-color':v.color}" :class="v.tribe" :data-title-loc='k' @click='checkLocation(k)'>

          </div>

          <svg class='svg-line' height='550' width='1200' v-for='(v, k) in pathes'>
            <line stroke-dasharray='10, 5' :x1="v[0]['positionX']" :y1="v[0]['positionY']" :x2="v[1]['positionX']" :y2="v[1]['positionY']" style="stroke:gray;stroke-width:1" />
          </svg>

        </div>

        <div class="gameover-outer" v-if='modStore'>
          <div class="gameover mod-store">
            <i class="fa fa-times" @click='modStore = !modStore'></i>
            <h5>Modificators store</h5>
            <div class="row mod-outer" v-if='!renderComponent'>
              <template v-for='(v, k) in game.modificatorsStore'>
                <div class="col-2 modificator-store">
                <span :class="v.class">
                  {{v.symbol}}
                </span>
                </div>
                <div class="description-text col-8">
                  <p>{{k}}<br>{{v.desc}}</p>
                </div>
                <div class="col-2 modificator-store">
                  <button v-if='game.intelligence >= v.price' @click='buyMod(k)' :data-title='"Price: "+v.price+" Int points"' class="buy-modificators">BUY</button>
                  <button v-else :data-title='"Not enough int points Price: "+v.price+" Int points"' class="buy-modificators">BUY</button>
                </div>
              </template>
              <div class="col-4">
                
              </div>
              <div class="col-4">
                <h5 v-if='!Object.keys(this.game.modificatorsStore).length'>Empty</h5>
              </div>
              <div class="col-4">
                
              </div>
            </div>
          </div>
        </div>

        <div class="gameover-outer" v-if='char_death'>
          <div class="gameover">
            <h5>RIP In Peace</h5>
            <div class="row">
              <div class="col-3 leader-img">
                <img src="static/images/pyth.png">
              </div>
              <div class="description-text col-9">
                  <h5>{{characterDie}}</h5>
                  <h5>{{(game.year - characterDieYears)}} B.C. - {{game.year}} B.C.</h5>
              </div>
            </div>
          </div>
          <br>
          <button class="gameover-exit" @click='char_death = !char_death'>OK</button>
        </div>


        <div class="gameover-outer" v-if='game.gameover_hunger'>
          <div class="gameover">
            <h5>GAME OVER</h5>
            <div class="gameover-desc-scroll">
              <div class="gameover-description row">
                <div class="col-1">

                </div>
                <div class="col-4">
                  <img src="static/images/riot.png">
                </div>
                <div class="col-1">

                </div>
                <div class="description-text col-5">
                The hunger of your settlement has exceeded all limits.<br>The population rebelled and fled from you.</div>
                <div class="col-1">

                </div>
              </div>
              <div class="gameover-description row">
                <div class="col-1">

                </div>
                <div class="col-4">
                  <img src="static/images/leader.png">
                </div>
                <div class="col-1">

                </div>
                <div class="description-text col-5">
                  The reign of the leader known as {{leader.name}} ended after {{game.day}} days</div>
                <div class="col-1">

                </div>
              </div>
              <br><br>
            </div>
          </div>
          <br>
          <router-link class="gameover-exit" to='/'>Exit to main menu</router-link>
        </div>

        <div class="gameover-outer" v-if='game.gameover_leader_death'>
          <div class="gameover">
            <h5>GAME OVER</h5>
            <div class="gameover-desc-scroll">
              <div class="gameover-description row">
                <div class="col-4">
                  <img src="static/images/leader.png">
                </div>
                <div class="description-text col-8">
                  <h5>RIP In Peace</h5>
                  <h5>{{leader.name}}</h5>
                  <h5>{{(game.year - leader.years)}} B.C. - {{game.year}} B.C.</h5>
                </div>
              </div>
              <div class="gameover-description row">
                <div class="col-1">

                </div>
                <div class="col-4">
                  <img src="static/images/leader.png">
                </div>
                <div class="col-1">

                </div>
                <div class="description-text col-5">
                  The reign of the leader known as {{leader.name}} ended after {{game.day}} days</div>
                <div class="col-1">

                </div>
              </div>
              <br><br>
            </div>
          </div>
          <br>
          <router-link class="gameover-exit" to='/'>Exit to main menu</router-link>
        </div>

        <div class="gameover-outer" v-if='loc_victory'>
          <div class="gameover">
            <h5>Victory</h5>
            <div class="gameover-desc-scroll">
              <div class="gameover-description row">
                <div class="col-4">
                  <img src="static/images/leader.png">
                </div>
                <div class="description-text col-8">
                  <h5>{{leader.name}} The Leader</h5>
                  <h5>{{leader.name}} captured everything in {{(942000 - game.year) * 360 + game.day}} days</h5>
                  <h5>{{(game.year - leader.years)}} B.C. - {{game.year}} B.C.</h5>
                </div>
              </div>
              <div class="gameover-description row">
                <div class="col-4">

                </div>
                <div class="col-6">
                  <div class="description-text">
                    Good work pithecantropus!
                  </div>
                </div>
                <div class="col-2">

                </div>
              </div>
              <br><br>
            </div>
          </div>
          <br>
          <router-link class="gameover-exit" to='/'>Exit to main menu</router-link>
        </div>

        <div class="battle-outer" v-if='captureWindow'>
          <div class="battle">
            <div class="row">
              <div class="col-3 battle-col">
                <div class="row pop-info-desc">
                  <div class="col-5">
                    Name
                  </div>
                  <div class="col-2">
                    Str
                  </div>
                  <div class="col-5">
                    Target
                  </div>
                </div>
                <div class="battle-info-scroll">
                  <template v-for='(v, k) in capture.tribes[capture.allies_tribe]'>
                    <div class="pop-info row">
                      <div :style='{"background-color":game.tribes[v.tribe].color}' class="col-5 pop-bordered check-character">
                      {{v.name}}
                      </div>
                      <div class="col-2 pop-str pop-bordered">
                        {{v.strength}}
                      </div>
                      <div class="col-5 pop-bordered">
                        {{v.goal}}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-6 battle-col col-center">
                <div class="row">
                  <div class="col-12 battle-info-desc">
                    Battle
                  </div>
                  <div class="col-6 battle-col allies-info">
                    <h5>Allies: {{capture.results[capture.allies_tribe].army}} / {{capture.results[capture.allies_tribe].total_army}}</h5>
                    <div class="battle-scroll">
                      <div class="rip-item row" v-for='(v, k) in capture.rip[capture.allies_tribe]'>
                        <div class="col-3">
                          <img src="static/images/pyth.png">
                        </div>
                        <div class="col-5">
                          {{v.name}}
                        </div>
                        <div class="col-4">
                          R.I.P
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 battle-col enemies-info">
                    <h5>Enemies: {{capture.results[capture.enemy_tribe].army}} / {{capture.results[capture.enemy_tribe].total_army}}</h5>
                    <div class="battle-scroll">
                      <div class="rip-item row" v-for='(v, k) in capture.rip[capture.enemy_tribe]'>
                        <div class="col-3">
                          <img src="static/images/pyth.png">
                        </div>
                        <div class="col-5">
                          {{v.name}}
                        </div>
                        <div class="col-4">
                          R.I.P
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 battle-col results-info">
                    <button v-if='endBattle' class="gameover-exit" @click='endBattleEvt()'>End battle</button>
                  </div>
                </div>
              </div>
              <div class="col-3 battle-col">
                <div class="row pop-info-desc">
                  <div class="col-5">
                    Target
                  </div>
                  <div class="col-2">
                    Str
                  </div>
                  <div class="col-5">
                    Name
                  </div>
                </div>
                <div class="battle-info-scroll">
                  <template v-for='(v, k) in capture.tribes[capture.enemy_tribe]'>
                    <div class="pop-info row">
                      <div class="col-5">
                        {{v.goal}}
                      </div>
                      <div class="col-2 pop-str pop-bordered">
                        {{v.strength}}
                      </div>
                      <div :style='{"background-color":game.tribes[v.tribe].color}' class="col-5 pop-bordered check-character">
                      {{v.name}}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="gameover-outer" v-if='game.info'>
          <div class="tutorial">
            <i class="fa fa-times" @click='game.info = !game.info'></i>
            <h5 v-if='info_page=="default"'>Welcome to the Pithecator tutorial</h5>
            <h5 v-if='info_page=="food"'>Food</h5>
            <h5 v-if='info_page=="explore"'>Explore locations</h5>
            <h5 v-if='info_page=="intelligence"'>Intelligence points</h5>
            <h5 v-if='info_page=="capture"'>Capture the enemies</h5>
            <h5 v-if='info_page=="controls"'>Controls</h5>
            <div class="row">
              <div class="col-3 leader-img">
                <img src="static/images/pyth.png">
              </div>
              <div class="description-text tutorial-btns col-9" v-if='info_page=="default"'>
                  <h5 @click='info_page="food"'>
                    Food
                  </h5>
                <div class="tutorial-no-scroll">
                  <h5 @click='info_page="explore"'>
                    Explore locations
                  </h5>
                  <h5 @click='info_page="intelligence"'>
                    Intelligence points
                  </h5>
                  <h5 @click='info_page="capture"'>
                    Capture the enemies
                  </h5>
                  <h5 @click='info_page="controls"'>
                    Controls
                  </h5>
                </div>
              </div>
              <div class="description-text tutorial-btns col-9" v-if='info_page=="food"'>
                <h5 @click='info_page="default"'>
                  Go back
                </h5>
                <div class="tutorial-scroll">
                  <div class="tutorial-text">
                    Your population shouldn't be hungry. So you must assign them to extract food. You can change status of the character in home window or window of any location at "pops" tab.
                  </div>
                  <div>
                    <img src="static/images/info/food1.png">
                  </div>
                  <div class="tutorial-text">
                    Location must have any of modificators that increases food extaction. But any of this modificators require specific conditions to extract it.
                  </div>
                  <div>
                    <img src="static/images/info/food2.png">
                  </div>
                  <div class="tutorial-text">
                    If character have more than 3.5 int points or more than 4.0 str, this gives a bonus to food extraction.
                  </div>
                </div>

              </div>
              <div class="description-text tutorial-btns col-9" v-if='info_page=="explore"'>
                <h5 @click='info_page="default"'>
                  Go back
                </h5>
                <div class="tutorial-scroll">
                  <div class="tutorial-text">
                    You can easily replace your character in any location closest to the explored location. All you have to do is go to the tab and click on the character's location. Then you have to choose which location you want to move him.
                  </div>
                  <div>
                    <img src="static/images/info/explore1.png">
                  </div>
                  <div class="tutorial-text">
                    If location have modificator "unexplored", you can assign your character in this location to explore it. Exploring requires 3.0 int points and it takes 2 days.
                  </div>
                  <div>
                    <img src="static/images/info/explore2.png">
                  </div>
                  <div>
                    More locations require more population. You can create new character in "pops" tab.
                  </div>
                </div>

              </div>
              <div class="description-text tutorial-btns col-9" v-if='info_page=="intelligence"'>
                <h5 @click='info_page="default"'>
                  Go back
                </h5>
                <div class="tutorial-scroll">
                  <div class="tutorial-text">
                    Intelligence points can be spent in the Modificators store.
                  </div>
                  <div>
                    <img src="static/images/info/intelligence1.png">
                  </div>
                  <div class="tutorial-text">
                    Some intelligence points can be obtained after exploring the location. But most of the points come from the extraction of food in location with specific modificators.
                  </div>
                  <div>
                    <img src="static/images/info/intelligence2.png">
                  </div>
                </div>

              </div>
              <div class="description-text tutorial-btns col-9" v-if='info_page=="capture"'>
                <h5 @click='info_page="default"'>
                  Go back
                </h5>
                <div class="tutorial-scroll">
                  <div class="tutorial-text">
                    You have a couple hostile locations on the map. Firstly you need explore this location to start capture.
                  </div>
                  <div>
                    <img src="static/images/info/capture1.png">
                  </div>
                  <div class="tutorial-text">
                    You must gather your army in this location before capture. It takes 1 day to get your army amount and total strength in current location.
                  </div>
                  <div>
                    <img src="static/images/info/capture2.png">
                  </div>
                  <div class="tutorial-text">
                    After you have at least 1 character in this location, you can start capture.
                    Capture will pass automatically. Victory depends on the strength and amount of your army.
                  </div>
                  <div>
                    <img src="static/images/info/capture3.png">
                  </div>
                  <div>
                    <img src="static/images/info/capture4.png">
                  </div>
                  <div class="tutorial-text">
                    After winning you can explore location.
                  </div>
                </div>

              </div>
              <div class="description-text tutorial-btns col-9" v-if='info_page=="controls"'>
                <h5 @click='info_page="default"'>
                  Go back
                </h5>
                <div class="tutorial-scroll">
                  <div class="tutorial-text row">
                    <div class="col-3">ESC</div><div class="col-9">Close all windows</div>
                    <div class="col-3">Space</div><div class="col-9">Pause</div>
                    <div class="col-3">I</div><div class="col-9">Open tutorial window</div>
                    <div class="col-3">H</div><div class="col-9">Open home window</div>
                    <div class="col-3">M</div><div class="col-9">Open modificators store window</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="pause-game-bar" v-if='pause'>
          <span>
            PAUSED
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <h5>Loading...</h5>
    </template>
  </div>
</template>

<script>

import Alert from './Alert'
import { page } from 'vue-analytics'

export default {
  props: ['showModal'],
  name: 'Game',
  metaInfo: {
        title: 'Pithecator | Gameplay',
        meta: [
          { vmid: 'description', property: 'description', content: 'Pithecator essential gameplay.' },
          { vmid: 'og:title', property: 'og:title', content: 'Pithecator | Gameplay' },
          { vmid: 'og:description', property: 'og:description', content: 'Pithecator essential gameplay.' },
        ],
  },
  data() {
    return {
      ajaxConfig: {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer: ' + this.$store.state.user.token
          }
      },
      game: {

      },
      leader: {

      },
      character: {

      },
      capture: {
        tribes: {

        },
        results: {

        },
        rip:{

        },
        allies_tribe: '',
        enemy_tribe: ''
      },
      captureWindow: false,
      menuCharacter: false,
      renderComponent: false,
      current_location: '',
      pause : true,
      characters_count : 0,
      food_statistic: '+0.0',
      food_statistic_de: 0.0,
      food_statistic_in: 0.0,
      str_statistic: 0.0,
      showMessage: false,
      loading: true,
      location_check: true,
      menuLeft: false,
      modStore: false,
      location: true,
      showStatus: false,
      showStatusAll: false,
      showLocation: false,
      showLocationAll: false,
      statusCharacter: '',
      locationCharacter: '',
      hunger_counter: 0,
      endBattle: false,
      checkLocationName: '',
      checkLocationWindow: false,
      pathes: [],
      locationsDistance:[],
      char_death: false,
      characterDie: '',
      characterDieYears: 0,
      loc_victory: false,
      day_ct : '',
      battle_ct: '',
      info_page: 'default',
      selected: []
    }
  },
  methods : {
    track () {
      page('/game');
    },
    loadGame(){
          if(localStorage.getItem('game')){
            this.game = JSON.parse(localStorage.getItem('game'));

            this.current_location = 'home';

            this.refreshCharacters();

            for(let i in this.game.map){
              if(this.pathes.length > 0){

                if(this.pathes[this.pathes.length-1].length == 1){
                  this.pathes[this.pathes.length-1].push(this.game.map[i]);
                }

              }

              this.pathes.push([this.game.map[i]]);
              this.locationsDistance.push(this.game.map[i]['name']);
            }

            this.pathes.splice((this.pathes.length-1), 1);

            for(let i in this.game.locations){
              if(!this.game.locations[i].unknown){
                let current_id = this.locationsDistance.indexOf(i);
                this.locExplore(current_id);
              }
            }

            this.loading = false;
          }else{

          }
    },
    openMessage(){
      this.showMessage = true;
            setTimeout(() => {
              this.showMessage = false;
            }, 3000);
    },
    day_counter(){
        setInterval(() => {
          if(!this.pause && !this.game.gameover){
            this.game.day++
            if(this.game.day >= 360){
              this.game.day = 0;
              this.game.year--;
            }

            this.food_statistic_de = 0;
            this.str_statistic = 0;

            this.food_statistic_in = 0;

            let locations_win = true;

            for(let i in this.game.locations){

              if(this.game.locations[i].tribe !== 'default')
                locations_win = false;

              this.food_statistic_in = (parseFloat(this.food_statistic_in) + parseFloat(this.game.locations[i].food_extraction)).toFixed(1);

              this.game.intelligence = (parseFloat(this.game.intelligence) + parseFloat(this.game.locations[i].int_extraction)).toFixed(1);

              this.game.locations[i].army = {}
              this.game.locations[i].enemies = false;
            }


            for(let i in this.game.characters){

              this.game.characters[i].birthday++;

              if(this.game.characters[i].birthday >= 360){
                this.game.characters[i].years++;
                this.game.characters[i].birthday = 0;
                this.game.characters[i].modificators.supply['birthday'] = {
                  "increase" : 0.0,
                  "decrease" : 1.0,
                  "description" : "Today is " + this.game.characters[i].name + " birthday. He want's 1.0 more food."
                }
                this.game.characters[i].supply = (parseFloat(this.game.characters[i].supply) + parseFloat(1)).toFixed(1);
              }
              if(this.game.characters[i].birthday == 1){
                delete this.game.characters[i].modificators.supply.birthday;
                this.game.characters[i].supply = (parseFloat(this.game.characters[i].supply) - parseFloat(1)).toFixed(1);
              }

              if(this.game.characters[i].tribe == 'default'){
                this.food_statistic_de = (parseFloat(this.food_statistic_de) + parseFloat(this.game.characters[i].supply)).toFixed(1);

                if(this.game.characters[i].modificators.intelligence.explore){
                  this.game.characters[i].modificators.intelligence.explore.days--;
                  let location = this.game.characters[i].modificators.intelligence.explore.location;
                  if(this.game.characters[i].modificators.intelligence.explore.days == 0 || !this.game.locations[location].unknown){
                    this.game.locations[location].unknown = false;
                    this.game.locations[location].color = this.game.tribes.default.color;
                    if(!this.game.locations[location].enemies)this.game.locations[location].tribe = 'default';
                    let current_id = this.locationsDistance.indexOf(location);
                    this.locExplore(current_id);
                    delete this.game.characters[i].modificators.intelligence.explore;
                    this.game.characters[i].status = 'rest';
                    this.game.intelligence = (parseFloat(this.game.intelligence) + parseFloat(this.game.characters[i].intelligence_upd) - parseFloat(2)).toFixed(1);
                  }
                }
              }

              this.game.intelligence = parseFloat(this.game.intelligence) > 1000000000 ? 1000000000 : this.game.intelligence;

              if(this.game.characters[i].death.year <= this.game.characters[i].years && this.game.characters[i].death.day <= this.game.characters[i].birthday && this.game.characters[i].status !== 'explore'){
                if(this.game.characters[i].leader){
                  this.game.gameover_leader_death = true;
                  this.game.gameover = true;
                }else{
                  this.characterDie = i;
                  this.characterDieYears = this.game.characters[i].years;
                  this.statusCharacter = i;
                  this.changeStatus('rest');
                  delete this.game.characters[i];
                  if(this.game.characters[i].tribe == 'default'){
                    this.char_death = true;
                    this.pause = true;
                  }
                }
              }
              if(this.game.characters[i].tribe == 'default'){
                this.str_statistic = (parseFloat(this.str_statistic) + parseFloat(this.game.characters[i].strength_upd)).toFixed(1);
              }else
                this.game.locations[this.game.characters[i].location].enemies = true;

              if(this.game.locations[this.game.characters[i].location].army[this.game.characters[i].tribe] == undefined){
                  this.game.locations[this.game.characters[i].location].army[this.game.characters[i].tribe] = {
                  'strength': 0,
                  'size': 0
                }
              }
                this.game.locations[this.game.characters[i].location].army[this.game.characters[i].tribe].strength = (parseFloat(this.game.locations[this.game.characters[i].location].army[this.game.characters[i].tribe].strength) + parseFloat(this.game.characters[i].strength_upd)).toFixed(1);
                this.game.locations[this.game.characters[i].location].army[this.game.characters[i].tribe].size++;

            }

            this.food_statistic_de = parseFloat(this.food_statistic_de).toFixed(1);
            this.food_statistic_in = parseFloat(this.food_statistic_in).toFixed(1);




            if(parseFloat(this.food_statistic_de) > parseFloat(this.food_statistic_in))
              this.food_statistic = '-' + (parseFloat(this.food_statistic_de) - parseFloat(this.food_statistic_in)).toFixed(1);
            else
              this.food_statistic = '+' + (parseFloat(this.food_statistic_in) - parseFloat(this.food_statistic_de)).toFixed(1);

            this.game.food = (parseFloat(this.game.food) - parseFloat(this.food_statistic_de)).toFixed(1);
            this.game.food = (parseFloat(this.game.food) + parseFloat(this.food_statistic_in)).toFixed(1);
            this.game.food = parseFloat(this.game.food).toFixed(1) >= parseFloat(10000) ? parseFloat(10000) : parseFloat(this.game.food).toFixed(1);
            if(this.game.food < 0)
              this.hunger_counter += 1;
            else
              this.hunger_counter = 0;

            if(locations_win){
              this.game.gameover = true;
              this.loc_victory = true;
            }if(this.hunger_counter >= 3){
              let fortune = Math.round(Math.random());
              if(fortune){
                this.game.gameover_hunger = true;
                this.game.gameover = true;
              }
            }if(this.game.gameover == true){
              this.closeAllWindows();
              this.pause = true;
            }
          }
        }, 5000);
    },
    refreshCharacters(){
          this.characters_count = 0;
          for(let k in this.game.characters){

              if(this.game.characters[k].tribe == 'default')
                this.characters_count++;

              this.game.characters[k].strength_upd = this.game.characters[k].strength;
              this.game.characters[k].intelligence_upd = this.game.characters[k].intelligence;
              this.game.characters[k].supply_upd = this.game.characters[k].supply;

              for(let m in this.game.characters[k].modificators.strength){
                this.game.characters[k].strength_upd = this.game.characters[k].strength + this.game.characters[k].modificators.strength[m].increase - this.game.characters[k].modificators.strength[m].decrease
                this.game.characters[k].strength_upd = this.game.characters[k].strength_upd.toFixed(1)
              }

              for(let m in this.game.characters[k].modificators.intelligence){
                this.game.characters[k].intelligence_upd = this.game.characters[k].intelligence + this.game.characters[k].modificators.intelligence[m].increase - this.game.characters[k].modificators.intelligence[m].decrease
                this.game.characters[k].intelligence_upd = this.game.characters[k].intelligence_upd.toFixed(1)
              }

              for(let m in this.game.characters[k].modificators.supply){
                this.game.characters[k].supply_upd = this.game.characters[k].supply + this.game.characters[k].modificators.supply[m].increase - this.game.characters[k].modificators.supply[m].decrease
                this.game.characters[k].supply_upd = this.game.characters[k].supply_upd.toFixed(1)
              }

              if(this.game.characters[k].leader){
                this.leader = this.game.characters[k];
                this.leader.name = k;
              }

            }
            this.game.characters = this.reverseObject(this.game.characters);
    },
    saveExit(){
      localStorage.setItem('game', JSON.stringify(this.game));
      this.$router.push('/');
    },
    locExplore(current_id){
      if(current_id != 0){
        let left_id = current_id - 1;
        let left_name = this.locationsDistance[left_id];
        this.game.locations[left_name].explore = true;
      }if(current_id != (this.locationsDistance.length - 1)){
        let right_id = current_id + 1;
        let right_name = this.locationsDistance[right_id];
        this.game.locations[right_name].explore = true;
      }
    },
    openCharacter(name){
      this.character = this.game.characters[name];
      this.character.name = name;
      this.closeAllWindows();
      this.menuCharacter = true;
    },
    showStatusWindow(name){
      this.closePopTabs();
      this.showStatus = true;
      this.statusCharacter = name;
    },
    showLocationWindow(name){
      this.closePopTabs();
      this.showLocation = true;
      this.locationCharacter = name;
    },
    changeLocation(location){
      this.showLocation = false;
      this.statusCharacter = this.locationCharacter;
      this.changeStatus('rest');
      this.game.characters[this.locationCharacter].location = location;
    },
    changeLocationAll(location){
      this.showLocationAll = false;
      for(let i in this.selected){
        this.locationCharacter = this.selected[i];
        this.changeLocation(location);
      }
    },
    changeStatusAll(status){
      this.showStatusAll = false;
      for(let i in this.selected){
        console.log(i);
        let pop = this.game.characters[this.selected[i]];
        if(status == 'flora'){
          if(parseFloat(pop.intelligence_upd) < 2.5){
            continue;
          }
        }if(status == 'fauna'){
          if(parseFloat(pop.strength_upd) < 3.0){
            continue;
          }
        }if(pop.status == 'explore'){
          continue;
        }
        this.statusCharacter = this.selected[i];
        this.changeStatus(status);
      }
    },
    changeStatus(status){
      this.showStatus = false;
      let current_status = this.game.characters[this.statusCharacter].status;
      this.game.characters[this.statusCharacter].status = status;
      let loc = this.game.locations[this.game.characters[this.statusCharacter].location];
      let current_int = this.game.characters[this.statusCharacter].intelligence_upd;
      let current_str = this.game.characters[this.statusCharacter].strength_upd;
      if(current_status == 'flora'){
        for(let f in loc.modificators.food){
          if(parseFloat(current_int) < parseFloat(loc.modificators.food[f].required_int)){

          }else{
            loc.food_extraction = (parseFloat(loc.food_extraction) - parseFloat(loc.modificators.food[f].increase) - parseFloat(loc.modificators.food[f].decrease)).toFixed(1);
            if(parseFloat(this.game.characters[this.statusCharacter].intelligence_upd) >= parseFloat(3.5))
              loc.food_extraction = (parseFloat(loc.food_extraction) - parseFloat(this.game.characters[this.statusCharacter].intelligence_upd) + parseFloat(2.5)).toFixed(1);
            if(loc.modificators.food[f].int_increase !== undefined)
              loc.int_extraction = (parseFloat(loc.int_extraction) - parseFloat(loc.modificators.food[f].int_increase)).toFixed(1);
          }
        }
      }if(current_status == 'fauna'){
        for(let f in loc.modificators.animals){
          if(parseFloat(current_str) < parseFloat(loc.modificators.animals[f].required_str)){

          }else{
            loc.food_extraction = (parseFloat(loc.food_extraction) - parseFloat(loc.modificators.animals[f].increase) - parseFloat(loc.modificators.animals[f].decrease)).toFixed(1);
            if(parseFloat(this.game.characters[this.statusCharacter].strength_upd) >= parseFloat(4))
              loc.food_extraction = (parseFloat(loc.food_extraction) - parseFloat(this.game.characters[this.statusCharacter].strength_upd) + parseFloat(3.0)).toFixed(1);
            if(loc.modificators.animals[f].int_increase !== undefined)
              loc.int_extraction = (parseFloat(loc.int_extraction) - parseFloat(loc.modificators.animals[f].int_increase)).toFixed(1);
          }
        }
      }
      
      if(status == 'flora'){
        for(let f in loc.modificators.food){
          if(parseFloat(current_int) < parseFloat(loc.modificators.food[f].required_int)){

          }else{
            loc.food_extraction = (parseFloat(loc.food_extraction) + parseFloat(loc.modificators.food[f].increase) - parseFloat(loc.modificators.food[f].decrease)).toFixed(1);
            if(parseFloat(this.game.characters[this.statusCharacter].intelligence_upd) >= parseFloat(3.5))
              loc.food_extraction = (parseFloat(loc.food_extraction) + parseFloat(this.game.characters[this.statusCharacter].intelligence_upd) - parseFloat(2.5)).toFixed(1);
            if(loc.modificators.food[f].int_increase !== undefined)
              loc.int_extraction = (parseFloat(loc.int_extraction) + parseFloat(loc.modificators.food[f].int_increase)).toFixed(1);
          }
        }
      }if(status == 'fauna'){
        for(let f in loc.modificators.animals){
          if(parseFloat(current_str) < parseFloat(loc.modificators.animals[f].required_str)){

          }else{
            loc.food_extraction = (parseFloat(loc.food_extraction) + parseFloat(loc.modificators.animals[f].increase) - parseFloat(loc.modificators.animals[f].decrease)).toFixed(1);
            if(parseFloat(this.game.characters[this.statusCharacter].strength_upd) >= parseFloat(4))
              loc.food_extraction = (parseFloat(loc.food_extraction) + parseFloat(this.game.characters[this.statusCharacter].strength_upd) - parseFloat(3.0)).toFixed(1);
            if(loc.modificators.animals[f].int_increase !== undefined)
              loc.int_extraction = (parseFloat(loc.int_extraction) + parseFloat(loc.modificators.animals[f].int_increase)).toFixed(1);
          }
        }
      }if(status == 'explore'){
        let char = this.game.characters[this.statusCharacter];
        this.game.characters[this.statusCharacter].modificators.intelligence['explore'] = {
                  "increase" : 0.0,
                  "decrease" : 0.0,
                  "days" : 2,
                  "location": char.location,
                  "description" : this.statusCharacter + " explores the " + char.location + ". It will take 2 days."
                }
        this.game.pops_explore += 2;
        this.game.locations[char.location].status = 'exploring';
      }
    },
    createCharacter(location){
      let name = this.getLetter() + 'o' + this.getLetter() + 'o';
      if(this.game.characters[name] !== undefined){
        this.createCharacter(location);
        return false;
      }
      this.game.characters[name] = {
          "leader" : false,
          "status" : "rest",
          "name" : name,
          "location": location,
          "tribe": "default",
          "years" : this.randomInt(16, 39),
          "strength" : this.randomFloat(2.0, 4.5),
          "intelligence" : this.randomFloat(2.0, 4.5),
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
        this.game.food = (parseFloat(this.game.food) - parseFloat(this.game.characterPrice)).toFixed(1);
        this.refreshCharacters();
    },
    buyMod(name){
      this.renderComponent = true;
      this.game.locations.home.modificators.buildings[name] = this.game.modificatorsStore[name].mod;
      if(this.game.modificatorsStore[name].parameter == 'price'){
        this.game.characterPrice = 25;
      }else{
        for(let i in this.game.characters){
          if(this.game.characters[i].tribe=='default'){
            this.statusCharacter = i;
            let status = this.game.characters[i].status;
            this.changeStatus('rest');
            this.game.characters[i].modificators[this.game.modificatorsStore[name].parameter][name] = this.game.modificatorsStore[name].mod;

            if(this.game.modificatorsStore[name].parameter == 'intelligence'){
              this.game.characters[i].intelligence_upd = (parseFloat(this.game.characters[i].intelligence_upd) + parseFloat(this.game.characters[i].modificators.intelligence[name].increase)).toFixed(1);
            }if(this.game.modificatorsStore[name].parameter == 'strength'){
              this.game.characters[i].strength_upd = (parseFloat(this.game.characters[i].strength_upd) + parseFloat(this.game.characters[i].modificators.strength[name].increase)).toFixed(1);
            }

            this.changeStatus(status);
          }
        }
      }
      this.game.intelligence = (parseFloat(this.game.intelligence) - parseFloat(this.game.modificatorsStore[name].price)).toFixed(1);
      delete this.game.modificatorsStore[name];
      this.renderComponent = false;
    },
    startCapture(name){
      this.endBattle = false;
      this.capture = {
        tribes: {

        },
        results: {

        },
        rip:{

        },
        allies_tribe: '',
        enemy_tribe: ''
      }
      this.capture.allies_tribe = 'default';
      this.capture.enemy_tribe = this.game.locations[name].tribe;
      this.capture.rip[this.capture.allies_tribe] = [];
      this.capture.rip[this.capture.enemy_tribe] = [];
      for(let i in this.game.characters){
        if(this.game.characters[i].location == name){
          if(this.capture.tribes[this.game.characters[i].tribe] == undefined)
            this.capture.tribes[this.game.characters[i].tribe] = [];
          this.capture.tribes[this.game.characters[i].tribe].push({
            'name': i,
            'strength': this.game.characters[i].strength_upd,
            'goal':'',
            'self_damage':0.0,
            'tribe':this.game.characters[i].tribe
          });
          if(this.capture.results[this.game.characters[i].tribe] == undefined){
            this.capture.results[this.game.characters[i].tribe] = {
              'army':0,
              'total_army':0,
            }
          }
          this.capture.results[this.game.characters[i].tribe].army++;
          this.capture.results[this.game.characters[i].tribe].total_army++;
        }
      }
      this.captureWindow = true;
      this.battleEvent();
      this.battle_ct = setInterval(() => {
        this.battleEvent();
      }, 2000);
      this.pause = true;
    },
    battleEvent(){
        if(this.captureWindow){
          this.captureRefresh(this.capture.allies_tribe);
          this.captureRefresh(this.capture.enemy_tribe);
          let win = 0;
          if(this.capture.tribes[this.capture.allies_tribe].length == 0){
            win = 1;
          }if(this.capture.tribes[this.capture.enemy_tribe].length == 0){
            win = 1;
            this.game.locations[this.checkLocationName].tribe = this.capture.allies_tribe;
            this.game.locations[this.checkLocationName].color = this.game.tribes[this.capture.allies_tribe].color;
            this.game.locations[this.checkLocationName].unknown = false;
            this.game.locations[this.checkLocationName].enemies = false;
            this.game.locations[this.checkLocationName].explore = true;
          }if(win){
            this.endBattle = true;
            this.$forceUpdate();
            this.refreshCharacters();
            clearInterval(this.battle_ct);
            return false;
          }
          this.setGoal(this.capture.allies_tribe, this.capture.enemy_tribe);
          this.setGoal(this.capture.enemy_tribe, this.capture.allies_tribe);
        }
        this.$forceUpdate();
    },
    captureRefresh(tribe){
      for(let i in this.capture.tribes[tribe]){
        let char = this.capture.tribes[tribe][i];
        if(parseFloat(char.strength) <= parseFloat(char.self_damage)){
          this.capture.rip[tribe].push(char);
          this.capture.tribes[tribe].splice(i, 1);
          delete this.game.characters[char.name];
          this.capture.results[tribe].army--;
        }
        char.goal = '';
      }
    },
    setGoal(allie_tribe, enemy_tribe){
      let key = 0;
        for(let i in this.capture.tribes[allie_tribe]){
          if(this.capture.tribes[enemy_tribe][key] !== undefined){
            this.capture.tribes[allie_tribe][i].goal = this.capture.tribes[enemy_tribe][key].name;
            this.capture.tribes[enemy_tribe][key].self_damage = (parseFloat(this.capture.tribes[enemy_tribe][key].self_damage) + parseFloat(this.capture.tribes[allie_tribe][i].strength)).toFixed(1);
            if(parseFloat(this.capture.tribes[enemy_tribe][key].self_damage) > parseFloat(this.capture.tribes[enemy_tribe][key].strength)) key++;
          }
        }
    },
    selectCharacter(name){
      if(!this.selected.includes(name)){
        this.selected.push(name);
      }else{
        let index = this.selected.indexOf(name);
        this.selected.splice(index, 1);
      }
    },
    selectAll(location){
      for(let i in this.game.characters){
        if(this.game.characters[i].tribe=='default' && this.game.characters[i].location == location)
          this.selected.push(i);
      }
    },
    endBattleEvt(){
      this.captureWindow = !this.captureWindow;
      if(this.game.characters[this.leader.name] == undefined){
        this.game.gameover_leader_death = true;
        this.game.gameover = true;
      }
    },
    checkLocation(name){
      this.checkLocationName = name;
      this.closeAllWindows();
      this.checkLocationWindow = !this.checkLocationWindow;
    },
    menuLeftOpen(){
      let tf = this.menuLeft;
      this.closeAllWindows();
      this.menuLeft = !tf;
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
    reverseObject(object) {
        let newObject = {};
        let keys = [];

        for (let key in object) {
            keys.push(key);
        }

        for (let i = keys.length - 1; i >= 0; i--) {
          let value = object[keys[i]];
          newObject[keys[i]]= value;
        }       

        return newObject;
    },
    closeAllWindows(){
      this.showStatus = false;
      this.showLocation = false;
      this.showStatusAll = false;
      this.showLocationAll = false;
      this.menuLeft = false;
      this.menuCharacter = false;
      this.checkLocationWindow = false;
      this.modStore = false;
      this.game.info = false;
      this.selected = [];
      console.log(this.selected)
    },
    closePopTabs(){
      this.showStatus = false;
      this.showLocation = false;
      this.showStatusAll = false;
      this.showLocationAll = false;
    }
  },
  components: {
    alert: Alert
  },
  created(){
      this.loadGame();
      this.day_counter();
      window.addEventListener('keyup', (e) => {
        if(!this.game.gameover && !this.captureWindow){
          if (e.keyCode == 32 || e.keyCode == 19) { 
            this.pause = !this.pause;
          }if(e.keyCode == 27){
            this.closeAllWindows();
          }if(e.keyCode == 72){
            if(!this.menuLeft)this.closeAllWindows();
            this.menuLeft = !this.menuLeft;
          }if(e.keyCode == 73){
            if(!this.game.info)this.closeAllWindows();
            this.game.info = !this.game.info;
          }if(e.keyCode == 77){
            if(!this.modStore)this.closeAllWindows();
            this.modStore = !this.modStore;
          }
        }
      });
      this.track();
  }
};
</script>
