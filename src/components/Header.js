import React, { Component } from 'react';
import { Box, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { location } = this.props;

    
    return (
      <Box component="header" role="banner" sx={{ display: 'flex', justifyContent: 'center', mt: 2, px: 2 }}>
        <Box sx={{ bgcolor: 'background.paper', color: 'text.primary', borderRadius: { xs: '16px', sm: '16px' }, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)', width: '100%', maxWidth: 'lg', px: 3, py: 2 }}>
          <Toolbar disableGutters sx={{ 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            minHeight: '64px',
            px: 0,
            py: 0
          }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700, 
                letterSpacing: '1px',
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                textAlign: { xs: 'center', sm: 'left' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <Link 
                to="/" 
                style={{ textDecoration: 'none', color: 'inherit' }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'} 
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Grastaxi.info
              </Link>
            </Typography>
            
          </Toolbar>
        </Box>
      </Box>
    );
  }
}

