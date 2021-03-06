import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  Button,
  Col,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from "./LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { FadeTransform, Fade, Stagger } from "react-animation-components";

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLenght = (len) => (val) => val && val.length >= len;

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }
  toggleModal() {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }
  handleSubmit(values) {
    this.toggleModal();
    console.log("Current State is: " + JSON.stringify(values));
    alert("Current State is: " + JSON.stringify(values));
    this.props.postComment(
      this.props.dishId,
      values.rating,
      values.author,
      values.comment
    );
  }
  render() {
    return (
      <div>
        <Button outline onClick={this.toggleModal}>
          <span className="fa fa-pencil fa-lg"> Submit comment</span>
        </Button>
        <div className="row row-content">
          <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
            <ModalBody>
              <LocalForm onSubmit={(value) => this.handleSubmit(value)}>
                <Row className="form-group">
                  <Label htmlFor="name" md={2}>
                    Rating
                  </Label>
                  <Col md={10}>
                    <Control.select
                      model=".contactType"
                      className="form-control"
                      name="contactType"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Control.select>
                  </Col>
                </Row>
                <Row className="form-group">
                  <Label htmlFor="name" md={2}>
                    Your Name
                  </Label>
                  <Col md={10}>
                    <Control.text
                      model=".firstname"
                      className="form-control"
                      id="firstname"
                      name="firstname"
                      placeholder="First Name"
                      validators={{
                        required,
                        minLenght: minLenght(3),
                        maxLength: maxLength(15),
                      }}
                    ></Control.text>
                    <Errors
                      className="text-danger"
                      model=".firstname"
                      show="touched"
                      messages={{
                        required: "Required",
                        minLenght: "Must be greater than 2 characters",
                        maxLength: "Must be 15 characters or less",
                      }}
                    ></Errors>
                  </Col>
                </Row>
                <Row className="form-group">
                  <Label htmlFor="feedback" md={2}>
                    Your Feedback
                  </Label>
                  <Col md={10}>
                    <Control.textarea
                      model=".message"
                      className="form-control"
                      id="message"
                      name="message"
                      rows="12"
                    ></Control.textarea>
                  </Col>
                </Row>
                <Button type="submit" value="submit" className="bg-primary">
                  Submit
                </Button>
              </LocalForm>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}
function RenderComments({ comments, postComment, dishId }) {
  if (comments == null) {
    return <div></div>;
  }
  const cmnts = comments.map((comment) => {
    return (
      <Fade in>
        <div key={comment.id}>
          <p>{comment.comment}</p>
          <p>
            --{comment.author},{comment.date}
          </p>
        </div>
      </Fade>
    );
  });
  return (
    <div className="col-12 col-md-5 m-1">
      <h4> Comments</h4>
      <Stagger in>
        <div className="container">{cmnts}</div>
      </Stagger>
      <div>
        <CommentForm dishId={dishId} postComment={postComment}></CommentForm>
      </div>
    </div>
  );
}

function RenderDish({ dish }) {
  if (dish != null) {
    return (
      <div className="col-12 col-md-5 m-1">
        <FadeTransform
          in
          transformProps={{
            exitTransform: "scale(0.5) translateY(=50%)",
          }}
        >
          <Card>
            <CardImg
              top
              width="100%"
              src={baseUrl + dish.image}
              alt={dish.name}
            />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              <CardText>{dish.description}</CardText>
            </CardBody>
          </Card>
        </FadeTransform>
      </div>
    );
  } else {
    return <div></div>;
  }
}
const DishDetail = (props) => {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  } else if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  } else if (props.dish != null) {
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/menu">Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <RenderDish dish={props.dish} />
            </div>
            <div className="col-12">
              <RenderComments
                comments={props.comments}
                postComment={props.postComment}
                dishId={props.dish.id}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else return <div></div>;
};

export default DishDetail;
