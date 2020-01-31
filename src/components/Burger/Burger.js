import React from "react";

import classes from "./Burger.css";
import BurgerIngridient from "./BurgerIngridient/BurgerIngridient";

const burger = props => {
    let transoformedIngridients = Object.keys(props.ingridients)
        .map(igKey => {
            return [...Array(props.ingridients[igKey])].map((_, i) => {
                return <BurgerIngridient key={igKey + i} type={igKey} />;
            });
        })
        .reduce((arr, el) => {
            return arr.concat(el);
        }, []);
    if (transoformedIngridients.length === 0) {
        transoformedIngridients = <p>Please start adding ingridients!</p>;
    }
    console.log(transoformedIngridients);
    return (
        <div className={classes.Burger}>
            <BurgerIngridient type="bread-top"></BurgerIngridient>
            {transoformedIngridients}
            <BurgerIngridient type="bread-bottom"></BurgerIngridient>
        </div>
    );
};

export default burger;
