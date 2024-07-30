import React from 'react';
import './HomeComponent.css';

function HomeComponent() {
  return (
    <div className="home-container">
      <main className="main-content">
        <section className="content-section">
          <h2>Section 1</h2>
          <p>Content for section 1...</p>
        </section>
        <section className="content-section">
          <h2>Section 2</h2>
          <p>Content for section 2...</p>
        </section>
        <section className="content-section">
          <h2>Section 3</h2>
          <p>Content for section 3...</p>
        </section>
        <section className="content-section">
          <h2>Section 4</h2>
          <p>Content for section 4...</p>
        </section>
        <section className="content-section">
          <h2>Section 5</h2>
          <p>Content for section 5...</p>
        </section>
      </main>
    </div>
  );
}

export default HomeComponent;
