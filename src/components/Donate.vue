<template>
  <div class="row">

	<div class="gameover-outer">
          <div class="gameover">
            <h5>Support the project</h5>
            <div class="row">
              <div class="col-3">
                
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label><strong>Webmoney</strong></label>
                  <p>WMZ Z905100518783</p>
                  <p>WMP P300594235440</p>
                </div>
              	<!--<div class="form-group">
              		<label for="exampleFormControlInput1"><strong>Paypal</strong></label>
                  <div class="row">
                    <div class="col-6">
                      <input id="exampleFormControlInput1" type="number" v-model='amount' class="form-control">
                    </div>
                    <div class="col-6">
                      <select class="form-control" v-model="selected">
                        <option selected="selected" value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="RUB">RUB</option>
                      </select>
                    </div>
        			  	  
                  </div>
        			  </div>
        			  <div class="form-group">
        			  	<PayPal :amount="amount" :currency="selected" :client="credentials"></PayPal>
        			  </div>-->
                <div class="form-group">
                  <label>Сontact me if you have any questions <strong>eugenelekht@gmail.com</strong></label>
                </div>
              </div>
              <div class="col-3">
                
              </div>
            </div>
          </div>
    	</div>
    </div>

  </div>
</template>

<script>

//import PayPal from 'vue-paypal-checkout'

export default {
  props: ['showModal'],
  name: 'Menu',
  metaInfo: {
        title: 'Pithecator | Donate',
        meta: [
          { vmid: 'description', property: 'description', content: 'Pithecator essential donate.' },
          { vmid: 'og:title', property: 'og:title', content: 'Pithecator | Donate' },
          { vmid: 'og:description', property: 'og:description', content: 'Pithecator essential donate.' },
        ],
  },
  data() {
    return {
    	amount: '5',
      selected: 'USD',
  		credentials: {
  			sandbox: '',
  			production: 'ASnkxMfNe3FTNvBFLCMnapaI0qJ0-53WIg2hSkTEUJej-pSe5fdncCeuNNJA0I4kmhs1YPq1cYcGZJTv'
  		},
    }
  },
  methods : {
  
  },
  components: {
    //PayPal: PayPal
  },
  created(){

  }
};
</script>
