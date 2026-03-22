import React from 'react'
import styled from 'styled-components'

const OfferHoverCard = ({ step, title, text, imageSrc, imageAlt }) => {
  return (
    <StyledWrapper>
      <div className="card-container">
        <div className="card">
          <div className="front-content">
            {imageSrc ? <img src={imageSrc} alt={imageAlt || title} className="front-image" loading="lazy" /> : null}
            <div className="front-overlay" aria-hidden="true" />
            <p className="front-title">
              <span>{step}</span>
              <span className="front-title-text">{title}</span>
            </p>
          </div>
          <div className="content">
            <p className="heading">{title}</p>
            <p>{text}</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  height: 100%;

  .card-container {
    width: 100%;
    min-height: 390px;
    height: 100%;
    position: relative;
    border-radius: 36px;
    border: 1px solid #c6c8c9;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .card {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .card .front-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    position: relative;
    padding: 26px 28px;
    background: #101214;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card .front-content .front-title {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 16px;
    width: 100%;
    position: relative;
    z-index: 2;
    font-size: clamp(28px, 2.3vw, 46px);
    line-height: 1.05;
    letter-spacing: -0.015em;
    font-weight: 700;
    color: #f6f7f8;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card .front-content .front-title-text {
    flex: 1;
    margin-left: 16px;
    text-align: right;
  }

  .card .front-content .front-title span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 46px;
    width: 46px;
    height: 46px;
    border-radius: 999px;
    font-size: 15px;
    line-height: 1;
    background: rgba(20, 26, 31, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #f3f8f5;
  }

  .card .front-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 0;
  }

  .card .front-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.88) 0%,
      rgba(0, 0, 0, 0.54) 42%,
      rgba(0, 0, 0, 0.22) 68%,
      rgba(0, 0, 0, 0.06) 100%
    );
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    gap: 10px;
    background: linear-gradient(145deg, #081a13 0%, #0f2a1f 45%, #133020 100%);
    color: #f5eedb;
    padding: 26px 28px;
    line-height: 1.45;
    border-radius: 36px;
    pointer-events: none;
    transform: translateX(-96%);
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .card .content .heading {
    margin: 0;
    font-size: clamp(26px, 2vw, 40px);
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #ffffff;
  }

  .card .content p {
    margin: 0;
    max-width: 26ch;
    font-size: clamp(16px, 1.05vw, 22px);
    line-height: 1.42;
    color: #f5eedb;
  }

  .card:hover .content {
    transform: translateX(0);
  }

  .card:hover .front-content {
    transform: translateX(-30%);
  }

  .card:hover .front-content p {
    opacity: 0;
  }

  .card:hover .front-image {
    opacity: 0;
    transform: translateX(-18%);
  }

  .card:hover .front-overlay {
    opacity: 0;
    transform: translateX(-18%);
  }

  @media (max-width: 1100px) {
    .card-container {
      min-height: 330px;
      border-radius: 28px;
    }

    .card .front-content {
      padding: 26px 28px;
    }

    .card .content {
      padding: 26px 28px;
      border-radius: 28px;
    }

  }

  @media (max-width: 760px) {
    .card-container {
      min-height: 0;
      border-radius: 22px;
    }

    .card .front-content {
      padding: 20px;
    }

    .card .front-content .front-title {
      gap: 10px;
      font-size: clamp(30px, 9vw, 44px);
    }

    .card .front-content span {
      min-width: 42px;
      width: 42px;
      height: 42px;
      font-size: 14px;
    }

    .card .content {
      padding: 20px;
      border-radius: 22px;
      gap: 10px;
    }

    .card .content p {
      max-width: none;
    }

  }
`

export default OfferHoverCard
