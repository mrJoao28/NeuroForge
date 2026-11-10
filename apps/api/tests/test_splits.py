import numpy as np
from neuroforge_api.splits import split_dataset

def test_split_is_reproducible_and_disjoint():
    x=np.arange(20,dtype=float).reshape(-1,1)
    y=x*2
    train,validation=split_dataset(x,y,0.2,42)
    assert validation is not None
    assert len(train[0])==16 and len(validation[0])==4
    assert set(train[0].ravel()).isdisjoint(set(validation[0].ravel()))
    other=split_dataset(x,y,0.2,42)
    np.testing.assert_array_equal(train[0],other[0][0])

def test_no_validation():
    x=np.array([[0.],[1.]])
    assert split_dataset(x,x,0,42)[1] is None

def test_two_samples():
    x=np.array([[0.],[1.]])
    train,val=split_dataset(x,x,0.5,42)
    assert len(train[0])==1 and len(val[0])==1
