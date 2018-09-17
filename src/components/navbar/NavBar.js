/*
 * Copyright (C) 2018 Alasdair Mercer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';

import 'typeface-lobster-two/index.css';

import { ScreenReaderOnly } from '../a11y';
import { host } from '../../config';

import './NavBar.css';

class NavLink extends Component {

  render() {
    const { className, href, icon, internal, name, t } = this.props;
    const text = t(`navbar.link.${name}.text`);
    const title = t(`navbar.link.${name}.title`);
    let rel;
    let target;

    if (!internal) {
      rel = 'noopener';
      target = '_blank';
    }

    return (
      <a
        className={className || 'navbar__link'}
        href={href}
        rel={rel}
        target={target}
        title={title}
        data-name={name}
      >
        <FontAwesomeIcon icon={icon} size="2x" />
        <ScreenReaderOnly>{text}</ScreenReaderOnly>
      </a>
    );
  }

}

NavLink.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]).isRequired,
  internal: PropTypes.bool,
  name: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

class NavDropdown extends Component {

  constructor(props) {
    super(props);

    this.state = { isOpen: false };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen
    }));
  }

  render() {
    const { icon, links, name, t } = this.props;
    const { isOpen } = this.state;
    const text = t(`navbar.link.${name}.text`);
    const title = t(`navbar.link.${name}.title`);

    return (
      <div
        className={classNames('navbar__dropdown', `navbar__dropdown--${isOpen ? 'open' : 'closed'}`)}
      >
        <button
          className="navbar__link"
          title={title}
          data-name={name}
          aria-haspopup={true}
          aria-expanded={isOpen}
          onClick={this.onClick}
        >
          <FontAwesomeIcon icon={icon} size="2x" />
          <ScreenReaderOnly>{text}</ScreenReaderOnly>
        </button>
        <div className="navbar__dropdown_menu">
          {links.map((link) => <NavLink
            key={link.name}
            className="navbar__dropdown_item"
            href={link.href}
            icon={link.icon}
            internal={link.internal}
            name={link.name}
            t={t}
          />)}
        </div>
      </div>
    );
  }

}

NavDropdown.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]).isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]).isRequired,
    internal: PropTypes.bool,
    name: PropTypes.string.isRequired,
  })).isRequired,
  name: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

class NavBar extends Component {

  constructor(props) {
    super(props);

    const encHost = encodeURIComponent(host);

    this.links = [
      {
        name: 'social',
        icon: 'share-alt',
        links: [
          { name: 'twitter', href: `https://twitter.com/intent/tweet?status=${encHost}`, icon: [ 'fab', 'twitter-square' ] },
          { name: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encHost}`, icon: [ 'fab', 'facebook-square' ] },
          { name: 'googleplus', href: `https://plus.google.com/share?url=${encHost}`, icon: [ 'fab', 'google-plus' ] },
          { name: 'stumbleupon', href: `https://www.stumbleupon.com/submit?url=${encHost}`, icon: [ 'fab', 'stumbleupon-circle' ] }
        ]
      },
      { name: 'support', href: 'https://thebroonline.freshdesk.com', icon: 'life-ring' }
    ];
  }

  render() {
    const { t } = this.props;

    return (
      <nav className="navbar">
        <div className="navbar__header">
          <a className="navbar__title" href={host}>{t('title')}</a>
        </div>

        <div className="navbar__links">
          {this.links.map((link) => {
            return link.links ? (
              <NavDropdown
                key={link.name}
                icon={link.icon}
                links={link.links}
                name={link.name}
                t={t}
              />
            ) : (
              <NavLink
                key={link.name}
                href={link.href}
                icon={link.icon}
                internal={link.internal}
                name={link.name}
                t={t}
              />
            );
          })}
        </div>
      </nav>
    );
  }

}

NavBar.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate()(NavBar);
