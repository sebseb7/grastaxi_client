import React, { Component } from 'react';
import { Container, Box } from '@mui/material';

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    document.title = 'Grastaxi.info';
  }

  render() {

    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>

      </Container>
    );
  }
}
