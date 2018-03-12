import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Grid, Row, Col } from 'react-bootstrap'

import SearchBox from '../search-box'

/**
 * The home page component
 *
 * @param props
 * @constructor
 */
const Home = props => (
   <div>
      <Grid>
         <Row className="show-grid">
            <Col xs={12} md={5}>
               <SearchBox className={'c'} />
            </Col>
            <Col xs={12} md={7}>
               <h1>Hi!</h1>
               <p>Other content goes here</p>
            </Col>
         </Row>
      </Grid>

   </div>
)

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch)



export default connect(
   null,
   mapDispatchToProps
)(Home)