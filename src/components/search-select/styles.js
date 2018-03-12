import styled from 'styled-components';

export const SearchSelectContainer = styled.div`
   position:relative;
`

export const SearchInput = styled.input`
   padding: 12px 8% 12px 2%;
   line-height: 15px
`;

export const SelectMenu = styled.ul`
   border: 1px solid #e6e6e6;
   -webkit-box-shadow: 0 2px 2px rgba(0,0,0,0.4);
   box-shadow: 0 2px 2px rgba(0,0,0,0.4);
   position: absolute;
   padding: 0;
   list-style: none;
   width: 100%;
   background-color: #FFF;  
   font-size: .875em;
`;
export const Link = styled.a`
   
   color: #222;
   padding: 10px 9px;
   white-space: nowrap;
   overflow: hidden;
   border-radius: 0;
   display: block;
   cursor: pointer;
   text-decoration: none;
   top: 0;
   border: none;
   font-weight: 400;
     
   &:hover {
      text-decoration: none;
   }
`

export const OptionTypeLabel = styled.span`
   min-width: 50px;
   margin: 2px 10px 0 0;
   padding: 3px 5px;
   border-radius: 3px;
   text-align: center;
   font-weight: bold;
   color: #fff;
   vertical-align: top;
   min-width: 50px;
   display: inline-block;
   font-size: 85%;
   text-transform: capitalize;
       
   &.airport {
      background-color: #f2817f;
   }
   &.city {
      background-color: #6eb8fa;
   }
   &.district {
      background-color: #70d58e;
   }
   &.place {
      background-color: #ffa981;
   }
   &.station {
      background-color: #9d9dbb;   
   }
   &.train {
      background-color: #9d9dbb;
   }
`
export const OptionNameLabel = styled.span`
   white-space: nowrap;
   overflow: hidden;
   border-radius: 0;
   color: #222;
   display: inline-block;
   text-transform: capitalize;
   
   > em {
      font-weight: bold;
   }  
`
export const Error = styled.div`
   color: #c00;
   padding: 10px;
   display:block;  
`

export const Spinner = styled.img`
    background-image: url(https://cdn.rcstatic.com/images/site_graphics/newsite/preloader64.gif);
    height: 24px;
    width: 24px;
    right: 5px;
    top: 6px;
    position: absolute;
    background-size: contain;
    border: 0 !important;
    
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: optimizeQuality;
    -ms-interpolation-mode: bicubic;
`