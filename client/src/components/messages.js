import React from 'react';

class Messages extends React.Component {

  // getMembersData = () => {
  //   const authHeaders = {
  //     headers: {'x-auth': this.props.token }
  //   };
  //
  //   axios.get('/members', authHeaders)
  //     .then((response) => {
  //       this.setData(response.data)
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //   });
  // }

  componentWillMount() {

  }

  render() {
    return (
      <div>
          <section className="section">
            <div className="hero">
              <div className="hero-body">
                <div className="container has-text-centered content">
                  <p>This is the Messages component.</p>
                </div>
              </div>
            </div>
          </section>
      </div>
    );
  }
}

export default Messages;
