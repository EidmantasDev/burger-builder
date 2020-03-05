import React, { Component } from 'react';
import axios from '../../axios-orders';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGRIDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.4,
  cheese: 1,
  meat: 1.5
};
export class BurgerBuilder extends Component {
  // constructor(props){
  //     super(props);
  //     this.state = {...}
  // }

  componentDidMount() {
    axios
      .get('https://react-my-burger-142cd.firebaseio.com/ingridients.json')
      .then(response => {
        this.setState({ ingridients: response.data });
      })
      .catch(error => {
        this.setState({ error: true });
        return error;
      });
  }
  state = {
    ingridients: null,
    totalPrice: 0,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  };

  updatePurchaseState(ingridients) {
    const sum = Object.keys(ingridients)
      .map(igKey => {
        return ingridients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ purchasable: sum > 0 });
  }

  addIngridientHandler = type => {
    const oldCount = this.state.ingridients[type];
    const updatedCount = oldCount + 1;
    const updatedIngridients = {
      ...this.state.ingridients
    };
    updatedIngridients[type] = updatedCount;
    const priceAddition = INGRIDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
      totalPrice: newPrice,
      ingridients: updatedIngridients
    });
    this.updatePurchaseState(updatedIngridients);
  };

  removeIngridientHandler = type => {
    const oldCount = this.state.ingridients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngridients = {
      ...this.state.ingridients
    };
    updatedIngridients[type] = updatedCount;
    const priceDeduction = INGRIDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({
      totalPrice: newPrice,
      ingridients: updatedIngridients
    });
    this.updatePurchaseState(updatedIngridients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseContinueHandler = () => {
    // alert("You continue");
    this.setState({ loading: true });
    const order = {
      ingridients: this.state.ingridients,
      price: this.state.totalPrice,
      customer: {
        name: 'Eidmantas Slenys',
        address: {
          street: 'Ozo g.',
          zipCode: '236165',
          country: 'Lithuania'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    };
    axios
      .post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false, purchasing: false });
        return response;
      })
      .catch(error => {
        this.setState({ loading: false, purchasing: false });
        console.log(error);
      });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  render() {
    const disabledInfo = {
      ...this.state.ingridients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.state.error ? (
      <p>Ingridients can't be loaded</p>
    ) : (
      <Spinner />
    );

    if (this.state.ingridients) {
      burger = (
        <Aux>
          <Burger ingridients={this.state.ingridients} />
          <BuildControls
            ingridientAdded={this.addIngridientHandler}
            ingridientRemoved={this.removeIngridientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingridients={this.state.ingridients}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.state.totalPrice}
        />
      );
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
