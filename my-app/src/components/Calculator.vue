<template>
    <div class="container">
        <div class="btn-group d-flex justify-content-end">       
            <button type="button"
                @click="undo"
                class="btn btn-outline-primary mt-3">undo
            </button>
            <button type="button"
                @click="redo" 
                class="btn btn-outline-primary mt-3">redo
            </button>
        </div> 
        <div class="calculator mx-auto mt-5">
            <div class="display mt-1 text-end">{{resultValue || 'enter'}}</div>
            <div class="row no-gutters">
                <div class="col-3" v-for="currentElement in calculatorElements" :key="currentElement">
                    <div 
                        class="buttons lead text-white py-3 m-1 mt-3 text-center rounded"
                        @click="doingMath">
                        {{currentElement}}
                    </div>
                </div>
            </div>
            <div class="container">
                <button type="button"
                    class="btn btn-success mt-3 btn-block" 
                    style="width:100%"
                    @click="checkResult"
                    >=</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default{
  name: 'Calculator',
  data(){
    return{
        resultValue: '',
        calculatorElements: [
           '*', '/', '-', '+', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "C"
        ],
        operationElements: ['*', '/', '-', '+'],
        
        resultsArr: [],
        idArr: 0
    }
  },
  methods: {
    doingMath(e){
        const currentElement = e.target.textContent;

        if(currentElement == 'C'){
            this.resultValue = '';
            return;
        }

        if(this.operationElements.includes(currentElement)){

            for(let op of this.operationElements){
                if(this.resultValue.includes(op) && this.resultValue[0] != op){
                    
                    axios.post('http://localhost:8081/api', {
                        operation: op,
                        values: this.resultValue 
                    })
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => console.log(error));
                    this.resultValue = response.data.result.toFixed(2) + '';
                             
                    this.resultsArr.push(this.resultValue);
                    this.idArr++;
                }
            }
        }
        this.resultValue += currentElement;
    },

    checkResult(){
        for(let op of this.operationElements){
            if(this.resultValue.includes(op)){

                axios.post('http://localhost:8081/api', {
                    operation: op,
                    values: this.resultValue 
                })
                .then(response => {console.log(response.data)
                    this.resultValue = response.data.result.toFixed(2) + '';

                    this.resultsArr.push(this.resultValue);
                    this.idArr++;
                })
                .catch(error => console.log(error));

            }
        }
    },

    undo(){
        this.idArr == this.resultsArr.length ? this.idArr-- : this.idArr;
        if(this.idArr > 0){
            this.idArr--;
            this.resultValue = this.resultsArr[this.idArr];
        }
    },

    redo(){
        if(this.idArr < this.resultsArr.length - 1){
            this.idArr++;
            this.resultValue = this.resultsArr[this.idArr];
        }
    },
  }
}
</script>

<style>
    .calculator{
        border: 2px solid black;
        border-radius: 5px;
        max-width: 400px;
        height: 500px;

    }
    .display{
        background-color: #3467eb;
        color: #080202;
        font-family: "IBM Plex Mono", monospace;
        font-size: 2em; 
        line-height: 2em;
        margin: 0.125em 0.125em 0 0.125em;
        padding: 0.125em;
    }
    .buttons {
        background-color: #080202;
        
        /* border-radius: 5px; */
    }
    .buttons:hover{
        background-color: #696969;
        cursor: pointer;
    }
</style>
